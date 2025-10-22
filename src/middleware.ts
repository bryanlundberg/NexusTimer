import { NextResponse } from 'next/server'
import { applyRateLimit, generalLimiter, getIP } from '@/lib/rate-limiter'

export async function middleware(req: Request) {
  // Get IP address for logging
  const ip = getIP(req)
  console.log(`Rate limiter check for IP: ${ip} on route: ${req.url}`)

  // Apply rate limiting
  const rateLimitResponse = await applyRateLimit(req, generalLimiter)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*']
}
