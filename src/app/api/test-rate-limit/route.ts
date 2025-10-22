import { NextResponse } from 'next/server'
import { applyRateLimit, uploadLimiter } from '@/lib/rate-limiter'

export async function GET(request: Request) {
  // Apply rate limiting - 3 requests per minute
  const rateLimitResponse = await applyRateLimit(request, uploadLimiter)
  if (rateLimitResponse) return rateLimitResponse

  return NextResponse.json({
    message: 'Rate limiter is working!',
    timestamp: new Date().toISOString()
  })
}
