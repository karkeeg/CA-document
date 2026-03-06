import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { hashToken } from "@/lib/auth/tokens";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const tokenHash = hashToken(token);

    // Find token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        tokenHash,
        type: "EMAIL_VERIFICATION",
      },
    });

    if (!verificationToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    // Check expiry
    if (new Date() > verificationToken.expires) {
      await prisma.verificationToken.delete({
        where: { identifier_type: { identifier: verificationToken.identifier, type: "EMAIL_VERIFICATION" } }
      });
      return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }

    // Update User
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    // Delete token
    await prisma.verificationToken.delete({
      where: { identifier_type: { identifier: verificationToken.identifier, type: "EMAIL_VERIFICATION" } }
    });

    return NextResponse.json({ success: true, message: "Email verified successfully" });

  } catch (error: any) {
    if (error.code === 'P1001' || error.message?.includes('P1001') || error.message?.includes('database server')) {
      console.error("Database connection error (P1001):", error);
      return NextResponse.json({ error: "Authentication database unreachable. Please retry soon." }, { status: 503 });
    }
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
