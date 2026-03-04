import { type User, type Session } from "../../../prisma/client/client";
import prisma from "@/lib/db";
import { generateToken } from "./tokens";

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 Days

export interface SessionResult {
  session: Session | null;
  user: User | null;
}

/**
 * Creates a new session in the database.
 */
export async function createSession(userId: string): Promise<Session> {
  const sessionId = generateToken();
  const session = await prisma.session.create({
    data: {
      id: sessionId,
      userId,
      expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
    },
  });
  return session;
}

/**
 * Validates a session ID.
 * Returns the Session and User if valid and not expired.
 * Also extends the session expiry if it's halfway through.
 */
export async function validateSession(sessionId: string): Promise<SessionResult> {
  const result = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!result) {
    return { session: null, user: null };
  }

  const { user, ...session } = result;

  // Check Expiry
  if (Date.now() >= session.expiresAt.getTime()) {
    await prisma.session.delete({ where: { id: sessionId } });
    return { session: null, user: null };
  }

  // Extend session if half way through (Sliding Window)
  const halfDuration = SESSION_DURATION_MS / 2;
  const timeRemaining = session.expiresAt.getTime() - Date.now();
  
  if (timeRemaining < halfDuration) {
    session.expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
    await prisma.session.update({
      where: { id: sessionId },
      data: { expiresAt: session.expiresAt },
    });
  }

  return { session, user };
}

/**
 * Invalidates a specific session.
 */
export async function invalidateSession(sessionId: string): Promise<void> {
  await prisma.session.delete({ where: { id: sessionId } }).catch(() => {
    // Ignore if already deleted
  });
}

/**
 * Invalidates ALL sessions for a user (e.g. on password reset or suspicious activity).
 */
export async function invalidateUserSessions(userId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { userId } });
}
