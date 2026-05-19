import { NextRequest, NextResponse } from 'next/server'
import { verifyCodeRequestSchema } from '@/features/authentication/model/api-schemas'
import { confirmRegistration } from '@/features/authentication/server/registration-service'
import { AuthError } from '@/features/authentication/server/auth-error'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = verifyCodeRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 })
  }

  try {
    await confirmRegistration(parsed.data)
    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }
    console.error('[verify-code]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
