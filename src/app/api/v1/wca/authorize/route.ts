import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { auth } from '@/shared/config/auth/auth'

const WCA_BASE = 'https://www.worldcubeassociation.org'

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin

  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/account?tab=account&wca=error', origin))
  }

  const state = randomUUID()
  const redirectUri = `${origin}/api/v1/wca/callback`

  const authorizeUrl = new URL('/oauth/authorize', WCA_BASE)
  authorizeUrl.searchParams.set('client_id', process.env.WCA_CLIENT_ID ?? '')
  authorizeUrl.searchParams.set('redirect_uri', redirectUri)
  authorizeUrl.searchParams.set('response_type', 'code')
  authorizeUrl.searchParams.set('scope', 'public')
  authorizeUrl.searchParams.set('state', state)

  const response = NextResponse.redirect(authorizeUrl)
  response.cookies.set('wca_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600
  })

  return response
}
