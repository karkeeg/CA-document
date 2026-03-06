import { NextResponse } from "next/server";
import { getSessionId } from "@/lib/auth/cookies";
import { validateSession } from "@/lib/auth/session";

export async function GET(request: Request) {
  try {
    const sessionId = await getSessionId(); // Server-side cookie read
    if (!sessionId) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const { user, session } = await validateSession(sessionId);
    
    if (!user || !session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
      },
    });

  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
