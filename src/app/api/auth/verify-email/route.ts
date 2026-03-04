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

    const verificationToken = await prisma.verificationToken.findFirst({
      where: { tokenHash, type: "EMAIL_VERIFICATION" },
    });

    if (!verificationToken) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // Check Expiry
    if (Date.now() > verificationToken.expires.getTime()) {
      await prisma.verificationToken.delete({
        where: { identifier_type: { identifier: verificationToken.identifier, type: "EMAIL_VERIFICATION" } }
      });
      return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }

    // Mark Email as Verified
    await prisma.$transaction([
      prisma.user.update({
        where: { email: verificationToken.identifier },
        data: { emailVerified: new Date() },
      }),
      prisma.verificationToken.delete({
        where: { identifier_type: { identifier: verificationToken.identifier, type: "EMAIL_VERIFICATION" } }
      }),
    ]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Verify Email error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
