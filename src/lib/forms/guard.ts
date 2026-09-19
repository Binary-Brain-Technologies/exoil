import { createHash } from "node:crypto";
import { headers } from "next/headers";

/**
 * Best-effort, per-instance rate limiter (fixed window). On Vercel each function instance keeps its own map,
 * so this stops bursts from one client, not distributed abuse. For a shared limit, set UPSTASH_REDIS_REST_URL
 * and UPSTASH_REDIS_REST_TOKEN (see docs/vercel-deployment.md) — then the shared limiter is used instead.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const buckets = new Map<string, { count: number; resetAt: number }>();

async function clientKey(form: string): Promise<string> {
  const h = await headers();
  // On Vercel x-real-ip / x-forwarded-for are set by the platform. Behind another proxy, configure it to overwrite them.
  const ip = h.get("x-real-ip") || (h.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || "unknown";
  const salt = process.env.RATE_LIMIT_SALT ?? "exoil";
  // Only a salted hash is kept, never the IP itself.
  return `${form}:${createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32)}`;
}

async function upstashHit(key: string): Promise<boolean | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["INCR", `rl:${key}`],
        ["PEXPIRE", `rl:${key}`, String(WINDOW_MS), "NX"],
      ]),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{ result?: number }>;
    const count = Number(data[0]?.result ?? 0);
    return count <= MAX_PER_WINDOW;
  } catch {
    return null; // fall back to the in-memory limiter
  }
}

/** Gives the slot back after a failed delivery, so "try again" does not lock the visitor out. */
export async function releaseRequest(form: string): Promise<void> {
  const key = await clientKey(form);
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    await fetch(`${url}/decr/rl:${encodeURIComponent(key)}`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }).catch(() => {});
    return;
  }
  const bucket = buckets.get(key);
  if (bucket && bucket.count > 0) bucket.count -= 1;
}

export async function allowRequest(form: string): Promise<boolean> {
  const key = await clientKey(form);
  const shared = await upstashHit(key);
  if (shared !== null) return shared;

  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    if (buckets.size > 5000) for (const [k, b] of buckets) if (b.resetAt < now) buckets.delete(k);
    return true;
  }
  bucket.count += 1;
  return bucket.count <= MAX_PER_WINDOW;
}

/** Honeypot filled → bot. Bots get a success-looking response and nothing is sent. */
export function isHoneypotFilled(website: string | undefined): boolean {
  return !!website && website.trim() !== "";
}

/**
 * Submitted implausibly fast after the form rendered (JS-enabled clients only). A missing timestamp (no JavaScript)
 * is NOT treated as spam — the honeypot and the rate limit still apply. Callers answer with a neutral "try again",
 * never with a fake success, so a real person is never silently dropped.
 */
export function isTooFast(startedAt: string | undefined, minMs = 1500): boolean {
  const started = Number(startedAt);
  if (!startedAt || !Number.isFinite(started) || started <= 0) return false;
  return Date.now() - started < minMs;
}
