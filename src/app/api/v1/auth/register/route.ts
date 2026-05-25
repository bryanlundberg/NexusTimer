import { NextRequest, NextResponse } from 'next/server'
import { registerRequestSchema } from '@/features/authentication/model/api-schemas'
import { createPendingRegistration } from '@/features/authentication/server/registration-service'
import { AuthError } from '@/features/authentication/server/auth-error'
import { parseJsonBody } from '@/shared/api/parse-json'
import { created, serverError } from '@/shared/api/responses'

export async function POST(req: NextRequest) {
  const body = await parseJsonBody(req, registerRequestSchema)
  if (body instanceof Response) return body

  try {
    await createPendingRegistration(body)
    return created({ ok: true })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }
    return serverError('register', error)
  }
}
