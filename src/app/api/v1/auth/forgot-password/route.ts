import { NextRequest, NextResponse } from 'next/server'
import { forgotPasswordRequestSchema } from '@/features/authentication/model/api-schemas'
import { requestPasswordReset } from '@/features/authentication/server/password-reset-service'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = forgotPasswordRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 })
  }

  try {
    await requestPasswordReset(parsed.data.email)
  } catch (error) {
    console.error('[forgot-password]', error)
  }

  return NextResponse.json({ ok: true })
}
