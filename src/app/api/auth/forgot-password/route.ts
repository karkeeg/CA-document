import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { generateToken, hashToken } from "@/lib/auth/tokens";
import { rateLimit } from "@/lib/security/rate-limit";
import { sendPasswordResetEmail } from "@/lib/email";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    // 1. Rate Limit
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await rateLimit(`forgot-password:${ip}`, { limit: 3, window: 60 * 60 });
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();
    const result = forgotPasswordSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    
    const { email } = result.data;
    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to prevent enumeration
    if (!user) {
      return NextResponse.json({ success: true, message: "If that email exists, we sent a link." });
    }

    // 2. Generate Token
    const token = generateToken(); // 32 bytes hex
    const tokenHash = hashToken(token); // SHA-256
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 Hour

    // 3. Store in DB (Upsert to replace old ones)
    await prisma.verificationToken.upsert({
      where: {
        identifier_type: { identifier: email, type: "PASSWORD_RESET" }
      },
      update: { tokenHash, expires: expiresAt },
      create: {
        identifier: email,
        tokenHash,
        type: "PASSWORD_RESET",
        expires: expiresAt,
      },
    });

    // 4. Send Email (Real)
    try {
      await sendPasswordResetEmail(email, token);
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      // We still return success to prevent enumeration
    }

    return NextResponse.json({ success: true, message: "If that email exists, we sent a link." });

  } catch (error) {
    console.error("Forgot Password error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
