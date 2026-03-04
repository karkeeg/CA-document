import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { generateToken, hashToken } from "@/lib/auth/tokens";
import { rateLimit } from "@/lib/security/rate-limit";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Rate Limit (Prevent Spam)
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await rateLimit(`resend:${ip}`, { limit: 3, window: 60 * 60 }); // 3 per hour
    if (!success) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
        // Generic success to prevent enumeration
        return NextResponse.json({ success: true, message: "If the email exists, a verification link has been sent." });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: "Email already verified" }, { status: 400 });
    }

    // Generate NEW Token
    const token = generateToken();
    const tokenHash = hashToken(token);
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

    // Delete old tokens for this user
    await prisma.verificationToken.deleteMany({
      where: { identifier: email, type: "EMAIL_VERIFICATION" },
    });

    // Save new token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        tokenHash,
        type: "EMAIL_VERIFICATION",
        expires,
      },
    });

    // Send Email (Real)
    try {
      await sendVerificationEmail(email, token);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Verification email resent." });

  } catch (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
