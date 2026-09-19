import fs from "node:fs";
import path from "node:path";

/**
 * News posts live in content/news/<slug>.md with a small front-matter block:
 *
 * ---
 * title: Tytuł
 * date: 2026-10-01
 * description: Jedno zdanie do listy i metadanych.
 * ---
 *
 * Posts are read at build time only (static pages); nothing is written at runtime.
 */
export interface NewsPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  body: string;
}

const NEWS_DIR = path.join(process.cwd(), "content", "news");

export function parseFrontMatter(source: string): { data: Record<string, string>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source);
  if (!match) return { data: {}, body: source };
  const data: Record<string, string> = {};
  for (const line of (match[1] ?? "").split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { data, body: match[2] ?? "" };
}

export function getNewsPosts(): NewsPost[] {
  if (!fs.existsSync(NEWS_DIR)) return [];
  return fs
    .readdirSync(NEWS_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((file) => {
      const { data, body } = parseFrontMatter(fs.readFileSync(path.join(NEWS_DIR, file), "utf8"));
      return {
        slug: file.replace(/\.md$/, ""),
        title: data.title ?? file,
        date: data.date ?? "",
        description: data.description ?? "",
        body,
      };
    })
    .filter((p) => p.title && /^\d{4}-\d{2}-\d{2}$/.test(p.date))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function hasNews(): boolean {
  return getNewsPosts().length > 0;
}
