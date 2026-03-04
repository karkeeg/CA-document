import * as argon2 from "argon2";

export const hashPassword = async (password: string): Promise<string> => {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456, // 19 MB
    timeCost: 2,
    parallelism: 1,
  });
};

export const verifyPassword = async (
  hash: string,
  plain: string
): Promise<boolean> => {
  try {
    return await argon2.verify(hash, plain);
  } catch (err) {
    // Fail safe
    console.error("Password verification failed:", err);
    return false;
  }
};
