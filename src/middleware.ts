import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // 1. Security Headers (Defense in Depth)
  // Content-Security-Policy: Prevent XSS
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, " ").trim();

  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Frame-Options", "DENY"); // Prevent Clickjacking
  response.headers.set("X-Content-Type-Options", "nosniff"); // Prevent MIME Sniffing
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // 2. Auth Check for Protected Routes
  // Simple check: user must have session cookie to access /dashboard
  const sessionToken = request.cookies.get("auth_session")?.value;
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard");

  if (isProtectedRoute && !sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. CSRF Protection for Mutations (Mock Implementation in Middleware vs API)
  // For API routes, we might handle CSRF via custom headers or checking Origin/Referer
  if (request.method !== "GET" && request.method !== "HEAD") {
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");
    const host = request.headers.get("host");

    // Strict Origin Check
    if (origin && new URL(origin).host !== host) {
      return new NextResponse("CSRF Detected: Origin Mismatch", { status: 403 });
    }
    // If no origin (sometimes happens), check referer
    if (referer && new URL(referer).host !== host) {
      return new NextResponse("CSRF Detected: Referer Mismatch", { status: 403 });
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Apply to all routes except static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
