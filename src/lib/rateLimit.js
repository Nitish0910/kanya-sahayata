// Simple in-memory rate limiter for API routes
const rateLimitMap = new Map();

/**
 * Rate limiter for API routes
 * @param {string} key - Unique identifier (e.g., IP address or email)
 * @param {number} maxAttempts - Maximum attempts allowed in the window
 * @param {number} windowMs - Time window in milliseconds (default: 15 minutes)
 * @returns {{ allowed: boolean, remaining: number, resetIn: number }}
 */
export function rateLimit(key, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  // Clean up expired entries periodically
  if (rateLimitMap.size > 1000) {
    for (const [k, v] of rateLimitMap) {
      if (now - v.startTime > windowMs) rateLimitMap.delete(k);
    }
  }

  if (!record || now - record.startTime > windowMs) {
    // New window
    rateLimitMap.set(key, { count: 1, startTime: now });
    return { allowed: true, remaining: maxAttempts - 1, resetIn: windowMs };
  }

  if (record.count >= maxAttempts) {
    const resetIn = windowMs - (now - record.startTime);
    return { allowed: false, remaining: 0, resetIn };
  }

  record.count++;
  return { allowed: true, remaining: maxAttempts - record.count, resetIn: windowMs - (now - record.startTime) };
}
