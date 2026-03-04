import crypto from "crypto";

/**
 * Generates a random high-entropy string (32 bytes hex).
 */
export const generateToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Hash a sensitive token (like a password reset token) before storing in DB.
 * Using SHA-256 (fast, secure enough for high-entropy inputs).
 */
export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

/**
 * Constant time comparison for tokens to prevent timing attacks.
 */
export const secureCompare = (a: string, b: string): boolean => {
  return crypto.timingSafeEqual(
    Buffer.from(a),
    Buffer.from(b.padEnd(a.length)) // Handle length mismatch safely-ish (though hash length should be constant)
  ) && a.length === b.length;
};
