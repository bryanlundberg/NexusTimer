export const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload'
}

export function withSecurityHeaders(response: Response): Response {
  const secured = new Response(response.body, response)
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) secured.headers.set(name, value)
  return secured
}
