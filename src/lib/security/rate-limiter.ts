/**
 * Sliding window in-memory rate limiter for Next.js Server Actions and API Routes.
 * Protects against brute-force attacks on login, signup, password resets, and enquiry spam.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up stale entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    record.timestamps = record.timestamps.filter((time) => now - time < 3600000); // 1 hour
    if (record.timestamps.length === 0) {
      rateLimitMap.delete(key);
    }
  }
}, 600000);

export interface RateLimitOptions {
  limit?: number; // max requests
  windowSeconds?: number; // per window
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { allowed: boolean; remaining: number; retryAfterSeconds?: number } {
  const limit = options.limit || 10;
  const windowMs = (options.windowSeconds || 60) * 1000;
  const now = Date.now();

  const record = rateLimitMap.get(identifier) || { timestamps: [] };

  // Filter timestamps within the current sliding window
  record.timestamps = record.timestamps.filter((time) => now - time < windowMs);

  if (record.timestamps.length >= limit) {
    const oldestTimestamp = record.timestamps[0];
    const retryAfterSeconds = Math.ceil((oldestTimestamp + windowMs - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, retryAfterSeconds),
    };
  }

  record.timestamps.push(now);
  rateLimitMap.set(identifier, record);

  return {
    allowed: true,
    remaining: limit - record.timestamps.length,
  };
}
