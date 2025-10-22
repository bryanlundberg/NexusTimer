import { createRouteHandler } from 'uploadthing/next'
import { ourFileRouter } from './core'
import { UTApi } from 'uploadthing/server'
import { applyRateLimit, uploadLimiter } from '@/lib/rate-limiter'

const handlers = createRouteHandler({
  router: ourFileRouter
})

// Wrap GET with rate limiting
export async function GET(request: Request) {
  const rateLimitResponse = await applyRateLimit(request, uploadLimiter)
  if (rateLimitResponse) return rateLimitResponse

  return handlers.GET(request)
}

// Wrap POST with rate limiting
export async function POST(request: Request) {
  const rateLimitResponse = await applyRateLimit(request, uploadLimiter)
  if (rateLimitResponse) return rateLimitResponse

  return handlers.POST(request)
}

export async function DELETE(request: Request) {
  // Apply rate limiting
  const rateLimitResponse = await applyRateLimit(request, uploadLimiter)
  if (rateLimitResponse) return rateLimitResponse

  const data = await request.json()
  const newUrl = data.url.substring(data.url.lastIndexOf('/') + 1)
  const utapi = new UTApi()
  await utapi.deleteFiles(newUrl)

  return Response.json({ message: 'ok' })
}
