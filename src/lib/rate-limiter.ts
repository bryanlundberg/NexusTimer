import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || ''
})

// Create different rate limiters for different use cases
export const generalLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(
    parseInt(process.env.RATE_LIMIT_POINTS || '10'), // 10 requests
    `${parseInt(process.env.RATE_LIMIT_DURATION || '60')} s` // Per 60 seconds
  ),
  analytics: true,
  prefix: '@upstash/ratelimit'
})

export const authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '60 s'), // 5 requests per minute
  analytics: true,
  prefix: '@upstash/ratelimit:auth'
})

export const uploadLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '60 s'), // 3 requests per minute
  analytics: true,
  prefix: '@upstash/ratelimit:upload'
})

export const readLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '60 s'), // 30 requests per minute
  analytics: true,
  prefix: '@upstash/ratelimit:read'
})

export const writeLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '60 s'), // 10 requests per minute
  analytics: true,
  prefix: '@upstash/ratelimit:write'
})

/**
 * Get IP address from request headers
 */
export function getIP(request: Request): string {
  const ip =
    request.headers.get('x-forwarded-for') ||
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-real-ip') ||
    'anonymous'

  // If x-forwarded-for contains multiple IPs, take the first one
  return ip.split(',')[0].trim()
}

/**
 * Apply rate limiting to a request using Upstash
 */
export async function applyRateLimit(
  request: Request,
  limiter: Ratelimit = generalLimiter
): Promise<NextResponse | null> {
  const ip = getIP(request)

  try {
    const { success, limit, reset, remaining } = await limiter.limit(ip)

    if (!success) {
      console.error(`Rate limit exceeded for IP: ${ip}`)
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          limit,
          remaining,
          reset: new Date(reset).toISOString()
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': new Date(reset).toISOString()
          }
        }
      )
    }

    return null // No error, request can proceed
  } catch (err) {
    console.error(`Rate limiter error for IP ${ip}:`, err)
    // In case of error, allow the request to proceed (fail open)
    return null
  }
}
