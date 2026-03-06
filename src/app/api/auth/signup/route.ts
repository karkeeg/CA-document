import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { rateLimit } from "@/lib/security/rate-limit";
import { generateToken, hashToken } from "@/lib/auth/tokens";
import { sendVerificationEmail } from "@/lib/email";

// Zod Schema for strict validation
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12, "Password must be at least 12 characters"),
});

export async function POST(request: Request) {
  try {
    // 1. Rate Limit (Prevent Registration Spam)
    // Identify by IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await rateLimit(`signup:${ip}`, { limit: 5, window: 60 * 60 }); // 5 per hour
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // 2. Validate Input
    const body = await request.json();
    const result = signupSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 });
    }

    const { email, password } = result.data;

    // 3. User Existence Check
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 }); 
    }

    // 4. Hash Password (Argon2id)
    const passwordHash = await hashPassword(password);

    // 5. Create User (Unverified)
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
      },
    });

    // 6. Generate Verification Token
    const token = generateToken();
    const tokenHash = hashToken(token);
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        tokenHash,
        type: "EMAIL_VERIFICATION",
        expires,
      },
    });

    // 7. Send Email (Real)
    try {
      await sendVerificationEmail(email, token);
    } catch (emailError) {
      // Log but don't fail signup? Or fail?
      // Better to fail so user knows to retry or check email later.
      // But user is already created. 
      // Let's rely on Resend logic if this fails.
      console.error("Failed to send verification email:", emailError);
    }

    // 8. Return Result (Sanitized)
    // Do NOT log the user in yet.
    return NextResponse.json({
      success: true,
      requiresVerification: true,
      message: "Please check your email to verify your account.",
    });

  } catch (error: any) {
    if (error.code === 'P1001' || error.message?.includes('P1001') || error.message?.includes('database server')) {
      console.error("Database connection error (P1001):", error);
      return NextResponse.json({ error: "Database service is temporarily down. Please try again shortly." }, { status: 503 });
    }
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
