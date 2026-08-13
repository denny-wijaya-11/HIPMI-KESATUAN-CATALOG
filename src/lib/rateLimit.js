import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Only initialize Redis if environment variables are present
// This prevents crashes if the user hasn't set up Upstash yet
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

let redis;
let ratelimit;

if (redisUrl && redisToken) {
  try {
    redis = new Redis({
      url: redisUrl,
      token: redisToken,
    });

    // Create a new ratelimiter, that allows 10 requests per 10 seconds
    ratelimit = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(10, '10 s'),
      analytics: true,
      prefix: '@upstash/ratelimit',
    });
  } catch (error) {
    console.error('Failed to initialize Upstash Redis:', error);
  }
}

/**
 * Validates a request against the rate limiter.
 * @param {string} identifier - A unique identifier (e.g., IP address or User ID)
 * @returns {Promise<{success: boolean, limit: number, remaining: number, reset: number}>}
 */
export async function checkRateLimit(identifier) {
  // If Upstash isn't configured, we just pass the request through.
  // This is a graceful fallback so the app doesn't break.
  if (!ratelimit) {
    console.warn('Rate limiting is disabled because UPSTASH_REDIS_REST_URL is missing.');
    return {
      success: true,
      limit: 10,
      remaining: 9,
      reset: Date.now() + 10000,
    };
  }

  try {
    const result = await ratelimit.limit(identifier);
    return result;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // If Redis fails, we should probably allow the request to prevent false positives blocking real users
    return {
      success: true,
      limit: 10,
      remaining: 9,
      reset: Date.now() + 10000,
    };
  }
}
