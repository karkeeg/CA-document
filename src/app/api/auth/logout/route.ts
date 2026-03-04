import { NextResponse } from "next/server";
import { deleteSessionCookie, getSessionId } from "@/lib/auth/cookies";
import { invalidateSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const sessionId = await getSessionId();
    
    if (sessionId) {
      await invalidateSession(sessionId);
    }

    await deleteSessionCookie();

    // Redirect to login page (Landing page /)
    // Use status 303 to force GET request for the redirect
    return NextResponse.redirect(new URL("/", request.url), { status: 303 });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.redirect(new URL("/", request.url), { status: 303 });
  }
}
