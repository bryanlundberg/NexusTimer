import { NextRequest, NextResponse } from 'next/server'
import { verifyCodeRequestSchema } from '@/features/authentication/model/api-schemas'
import { confirmRegistration } from '@/features/authentication/server/registration-service'
import { AuthError } from '@/features/authentication/server/auth-error'
import { parseJsonBody } from '@/shared/api/parse-json'
import { ok, serverError } from '@/shared/api/responses'

export async function POST(req: NextRequest) {
  const body = await parseJsonBody(req, verifyCodeRequestSchema)
  if (body instanceof Response) return body

  try {
    await confirmRegistration(body)
    return ok({ ok: true })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }
    return serverError('verify-code', error)
  }
}
