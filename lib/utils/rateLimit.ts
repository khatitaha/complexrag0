import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Create a new Upstash Redis instance
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create a new Ratelimit instance
// See https://upstash.com/docs/redis/sdks/ts/ratelimit/overview for more information
export const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"), // 10 requests per 10 seconds
  analytics: true,
  /**
   * Optional: A key prefix for the ratelimit keys in Redis.
   * Can be used to organize your keys on Redis.
   */
  prefix: "@upstash/ratelimit",
});