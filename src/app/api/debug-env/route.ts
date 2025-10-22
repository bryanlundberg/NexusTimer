import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasUpstashUrl: !!process.env.UPSTASH_REDIS_REST_URL,
    hasUpstashToken: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    urlPrefix: process.env.UPSTASH_REDIS_REST_URL?.substring(0, 20),
    rateLimitPoints: process.env.RATE_LIMIT_POINTS,
    rateLimitDuration: process.env.RATE_LIMIT_DURATION
  })
}
