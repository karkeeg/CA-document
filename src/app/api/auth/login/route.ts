import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { setSessionCookie } from "@/lib/auth/cookies";
import { rateLimit } from "@/lib/security/rate-limit";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  console.log("LOGIN API HIT");
  try {
    // 1. Rate Limit (Critical for Login)
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await rateLimit(`login:${ip}`, { limit: 10, window: 60 * 15 }); // 10 per 15 mins
    if (!success) {
      return NextResponse.json({ error: "Too many login attempts, please try again later." }, { status: 429 });
    }

    // 2. Validate Input
    const body = await request.json();
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const { email, password } = result.data;

    // 3. Find User
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // NEW: Check Email Verification
    if (!user.emailVerified) {
      return NextResponse.json({ error: "Email not verified. Please check your inbox." }, { status: 403 });
    }

    // 4. Verify Password
    const isValid = await verifyPassword(user.passwordHash, password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 5. Create Session & Set Cookie
    const session = await createSession(user.id);
    await setSessionCookie(session.id, session.expiresAt);

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email },
    });

  } catch (error: any) {
    if (error.code === 'P1001' || error.message?.includes('P1001') || error.message?.includes('database server')) {
      console.error("Database connection error (P1001):", error);
      return NextResponse.json({ error: "Database is temporarily unreachable. Please try again in 30 seconds." }, { status: 503 });
    }
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
