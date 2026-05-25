import { NextRequest, NextResponse } from 'next/server'
import { resetPasswordRequestSchema } from '@/features/authentication/model/api-schemas'
import { resetPassword, validateResetToken } from '@/features/authentication/server/password-reset-service'
import { AuthError } from '@/features/authentication/server/auth-error'
import { parseJsonBody } from '@/shared/api/parse-json'
import { badRequest, ok, serverError } from '@/shared/api/responses'

export async function GET(req: NextRequest) {
  const oobCode = req.nextUrl.searchParams.get('oobCode')
  if (!oobCode) return badRequest('Missing token')

  try {
    const { email } = await validateResetToken(oobCode)
    return ok({ ok: true, email })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }
    return serverError('reset-password:GET', error)
  }
}

export async function POST(req: NextRequest) {
  const body = await parseJsonBody(req, resetPasswordRequestSchema)
  if (body instanceof Response) return body

  try {
    const { email } = await resetPassword(body)
    return ok({ ok: true, email })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }
    return serverError('reset-password:POST', error)
  }
}
