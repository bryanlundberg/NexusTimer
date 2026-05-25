import { NextRequest } from 'next/server'
import { forgotPasswordRequestSchema } from '@/features/authentication/model/api-schemas'
import { requestPasswordReset } from '@/features/authentication/server/password-reset-service'
import { parseJsonBody } from '@/shared/api/parse-json'
import { ok } from '@/shared/api/responses'

export async function POST(req: NextRequest) {
  const body = await parseJsonBody(req, forgotPasswordRequestSchema)
  if (body instanceof Response) return body

  try {
    await requestPasswordReset(body.email)
  } catch (error) {
    console.error('[forgot-password]', error)
  }

  return ok({ ok: true })
}
