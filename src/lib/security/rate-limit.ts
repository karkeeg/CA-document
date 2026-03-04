import Redis from "ioredis";

// Initialize Redis.
// In production, ensure process.env.REDIS_URL is set.
// If using Upstash, the connection string works with ioredis too.
const redis = process.env.REDIS_URL 
  ? new Redis(process.env.REDIS_URL) 
  : null; // Null means we might need a fallback or fail-closed.

interface RateLimitConfig {
  limit: number;      // Max requests
  window: number;     // Window in seconds
}

/**
 * Generic Rate Limiting function.
 * Returns { success: boolean, remaining: number }
 * 
 * FAIL-SAFE: If Redis is down/missing, we perform a fail-closed or fail-open strategy.
 * For strict zero-trust login, we might want to fail-closed (block access) if rate limiting is broken.
 * Here we simply allow if Redis is missing to avoid dev friction, BUT log a warning.
 * In production, you should ensure Redis is up.
 */
export async function rateLimit(key: string, config: RateLimitConfig) {
  if (!redis) {
    console.warn("Redis not configured. Rate limiting is DISABLED. (Unsafe for production)");
    return { success: true, remaining: 0 }; // Fail-open for dev
  }

  try {
    const usage = await redis.incr(key);
    
    if (usage === 1) {
      await redis.expire(key, config.window);
    }

    if (usage > config.limit) {
      return { success: false, remaining: 0 };
    }

    return { success: true, remaining: config.limit - usage };

  } catch (error) {
    console.error("Rate limit error:", error);
    return { success: false, remaining: 0 };
  }
}
