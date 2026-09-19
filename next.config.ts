import type { NextConfig } from "next";
import { legacyRedirects } from "./src/lib/redirects";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  // Old WordPress URLs used trailing slashes; keeping them preserves exact slugs.
  trailingSlash: true,
  poweredByHeader: false,
  // Do not let `next dev` write agent-instruction files into the repository.
  agentRules: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
  },
  experimental: {
    serverActions: {
      // Allows a 5 MB PDF CV when RECRUITMENT_UPLOADS_ENABLED=true.
      bodySizeLimit: "6mb",
    },
  },
  async redirects() {
    return legacyRedirects().map((r) => ({ ...r, permanent: true }));
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
