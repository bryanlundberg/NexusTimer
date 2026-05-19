import { NextRequest, NextResponse } from 'next/server'
import { resetPasswordRequestSchema } from '@/features/authentication/model/api-schemas'
import { resetPassword, validateResetToken } from '@/features/authentication/server/password-reset-service'
import { AuthError } from '@/features/authentication/server/auth-error'

export async function GET(req: NextRequest) {
  const oobCode = req.nextUrl.searchParams.get('oobCode')
  if (!oobCode) {
    return NextResponse.json({ message: 'Missing token' }, { status: 400 })
  }

  try {
    const { email } = await validateResetToken(oobCode)
    return NextResponse.json({ ok: true, email })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }
    console.error('[reset-password:GET]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = resetPasswordRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 })
  }

  try {
    const { email } = await resetPassword(parsed.data)
    return NextResponse.json({ ok: true, email })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }
    console.error('[reset-password:POST]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
