import { validateSession } from "./session";
import { getSessionId } from "./cookies";

/**
 * Retrieves the current authenticated user.
 * Returns the user object if a valid session exists, otherwise null.
 */
export async function getCurrentUser() {
  const sessionId = await getSessionId();
  if (!sessionId) return null;

  const { user } = await validateSession(sessionId);
  return user;
}
