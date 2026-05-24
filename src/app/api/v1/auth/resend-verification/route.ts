import { NextRequest, NextResponse } from 'next/server'
import { resendRequestSchema } from '@/features/authentication/model/api-schemas'
import { refreshPendingCode } from '@/features/authentication/server/registration-service'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = resendRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 })
  }

  try {
    await refreshPendingCode(parsed.data.email)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[resend-verification]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
