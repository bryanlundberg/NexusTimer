import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/shared/config/mongodb/mongodb'
import User from '@/entities/user/model/user'
import { userProfileCache } from '@/entities/user/model/user-cache'
import { auth } from '@/shared/config/auth/auth'

const WCA_BASE = 'https://www.worldcubeassociation.org'

function redirectWith(origin: string, status: string) {
  const response = NextResponse.redirect(new URL(`/account?tab=account&wca=${status}`, origin))
  response.cookies.delete('wca_state')
  return response
}

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin

  try {
    const session = await auth()
    if (!session?.user?.id) return redirectWith(origin, 'error')

    const code = request.nextUrl.searchParams.get('code')
    const state = request.nextUrl.searchParams.get('state')
    const storedState = request.cookies.get('wca_state')?.value

    if (!code || !state || !storedState || state !== storedState) {
      return redirectWith(origin, 'error')
    }

    const redirectUri = `${origin}/api/v1/wca/callback`

    const tokenResponse = await fetch(`${WCA_BASE}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.WCA_CLIENT_ID,
        client_secret: process.env.WCA_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri
      })
    })

    if (!tokenResponse.ok) return redirectWith(origin, 'error')

    const { access_token: accessToken } = await tokenResponse.json()
    if (!accessToken) return redirectWith(origin, 'error')

    const meResponse = await fetch(`${WCA_BASE}/api/v0/me`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })

    if (!meResponse.ok) return redirectWith(origin, 'error')

    const meData = await meResponse.json()
    const wcaId: string | undefined = meData?.me?.wca_id

    if (!wcaId) return redirectWith(origin, 'no-id')

    await connectDB()

    try {
      await User.findByIdAndUpdate(session.user.id, { wcaId, wcaVerifiedAt: Date.now() })
      await userProfileCache.invalidate(session.user.id)
    } catch (error) {
      if (error instanceof Error && 'code' in error && (error as { code?: number }).code === 11000) {
        return redirectWith(origin, 'taken')
      }
      throw error
    }

    return redirectWith(origin, 'success')
  } catch (error) {
    console.error('[wca/callback]', error)
    return redirectWith(origin, 'error')
  }
}
