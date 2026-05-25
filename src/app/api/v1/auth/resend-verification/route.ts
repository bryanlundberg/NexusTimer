import { NextRequest } from 'next/server'
import { resendRequestSchema } from '@/features/authentication/model/api-schemas'
import { refreshPendingCode } from '@/features/authentication/server/registration-service'
import { parseJsonBody } from '@/shared/api/parse-json'
import { ok, serverError } from '@/shared/api/responses'

export async function POST(req: NextRequest) {
  const body = await parseJsonBody(req, resendRequestSchema)
  if (body instanceof Response) return body

  try {
    await refreshPendingCode(body.email)
    return ok({ ok: true })
  } catch (error) {
    return serverError('resend-verification', error)
  }
}
