import { NextResponse, type NextRequest } from "next/server";
import { isGonePath } from "@/lib/redirects";

/**
 * Legacy WordPress system URLs (admin, login, xmlrpc, REST API, uploads, feeds) answer 410 Gone
 * so search engines drop them instead of retrying. See docs/url-migration-map.md.
 */
export function proxy(request: NextRequest) {
  if (isGonePath(request.nextUrl.pathname)) {
    return new NextResponse("410 Gone — ten adres nie jest już dostępny. https://exoil.pl/", {
      status: 410,
      headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex" },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/wp-admin/:path*",
    "/wp-content/:path*",
    "/wp-includes/:path*",
    "/wp-json/:path*",
    "/wp-login.php",
    "/xmlrpc.php",
    "/feed/:path*",
    "/comments/feed/:path*",
  ],
};
