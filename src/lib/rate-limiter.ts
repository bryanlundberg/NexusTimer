import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || ''
})

// General rate limiter: 150 requests per minute
export const generalLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(150, '60 s'),
  analytics: true,
  prefix: '@upstash/ratelimit'
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
