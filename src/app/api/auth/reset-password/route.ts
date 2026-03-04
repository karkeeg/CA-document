import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { hashToken } from "@/lib/auth/tokens";
import { hashPassword } from "@/lib/auth/password";
import { invalidateUserSessions } from "@/lib/auth/session";

const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(12),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = resetPasswordSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { token, newPassword } = result.data;
    const tokenHash = hashToken(token);

    // 1. Find Token in DB (by hash)
    // We can't query by hash easily if we don't know the identifier? 
    // Wait, the schema has `@@unique([identifier, type])`.
    // But we only have the token here.
    // Issue: The DB schema stores `identifier` + `type`. We don't have the identifier in the magic link usually unless we pass it?
    // BETTER SECURE PATTERN: The magic link should contain ?token=...&email=... 
    // OR we change schema to make `tokenHash` unique? 
    // If we make `tokenHash` unique, we can look it up. 
    // Prisma schema: `verification_tokens` (identifier, type) is unique. `tokenHash` is NOT unique in my current schema (bad design? No, standard for next-auth).
    // Actually, usually you send `?token=XYZ` and looking up by token is easiest.
    // But looking up by tokenHash requires full table scan if it's not indexed.
    // I should probably add an index on `tokenHash` or ask user to provide email in the form? 
    // Asking for email + new password + token is safer/standard user flow (user confirms email).
    // Let's assume the UI asks for Email again, OR the link processes it.
    
    // UPDATE: I will require `email` in the body for lookup context, or I'll scan (bad).
    // Let's just create the index or use `findFirst` which might be slow if millions of tokens.
    // But for this task, I will require User to input email or pass it in query param.
    // Let's pass it in query param to the page, and the page submits it.
    
    // Let's update the schema? No, `tokenHash` collision is unlikely but `findFirst({ where: { tokenHash, type: 'PASSWORD_RESET' } })` is fine for now provided meaningful load isn't there.
    // Actually, I'll update the schema plan in thought, but implementation is set.
    // I will use `findFirst` for now, but strictly filtering by type.
    
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { tokenHash, type: "PASSWORD_RESET" },
    });

    if (!verificationToken) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // 2. Check Expiry
    if (Date.now() > verificationToken.expires.getTime()) {
      await prisma.verificationToken.delete({
        where: { identifier_type: { identifier: verificationToken.identifier, type: "PASSWORD_RESET" } }
      });
      return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }

    // 3. Update Password
    const passwordHash = await hashPassword(newPassword);
    
    await prisma.$transaction(async (tx) => {
      // Update User
      await tx.user.update({
        where: { email: verificationToken.identifier },
        data: { 
          passwordHash,
          tokenVersion: { increment: 1 } // Invalidate other sessions logically if we used that
        },
      });

      // Delete Token
      await tx.verificationToken.delete({
        where: { identifier_type: { identifier: verificationToken.identifier, type: "PASSWORD_RESET" } }
      });
      
      // Invalidate All Sessions (Hard Delete)
      await tx.session.deleteMany({
        where: { userId: (await tx.user.findUnique({ where: { email: verificationToken.identifier } }))!.id }
      });
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Reset Password error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
