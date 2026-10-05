import {
  type ApiError,
  type OkResponse,
  forgotPasswordRequestSchema,
  type PasswordResetEmailResponse,
  registerRequestSchema,
  resendRequestSchema,
  resetPasswordRequestSchema,
  verifyCodeRequestSchema
} from '@nexustimer/contracts'
import { Hono } from 'hono'
import { badRequest, created, ok, serverError } from '../../http/responses'
import type { AppEnv } from '../../http/types'
import { parseJson } from '../../http/validation'
import { logger, serializeError } from '../../lib/logger'
import { AuthError } from './auth.errors'
import type { PasswordResetService } from './password-reset.service'
import type { RegistrationService } from './registration.service'

export type AuthServices = {
  handler: (request: Request) => Promise<Response>
  registration: RegistrationService
  passwordReset: PasswordResetService
}

function failure(scope: string, error: unknown) {
  if (error instanceof AuthError) {
    return Response.json({ message: error.message } satisfies ApiError, { status: error.status })
  }
  return serverError(scope, error)
}

export function authRoutes({ handler, registration, passwordReset }: AuthServices) {
  return new Hono<AppEnv>()
    .on(['GET', 'POST'], '/auth/*', (c) => handler(c.req.raw))
    .post('/v1/auth/register', async (c) => {
      const body = await parseJson(c.req.raw, registerRequestSchema)
      if (body instanceof Response) return body

      try {
        await registration.register(body)
        return created<OkResponse>({ ok: true })
      } catch (error) {
        return failure('register', error)
      }
    })
    .post('/v1/auth/verify-code', async (c) => {
      const body = await parseJson(c.req.raw, verifyCodeRequestSchema)
      if (body instanceof Response) return body

      try {
        await registration.confirm(body)
        return ok<OkResponse>({ ok: true })
      } catch (error) {
        return failure('verify-code', error)
      }
    })
    .post('/v1/auth/resend-verification', async (c) => {
      const body = await parseJson(c.req.raw, resendRequestSchema)
      if (body instanceof Response) return body

      try {
        await registration.resendCode(body.email)
        return ok<OkResponse>({ ok: true })
      } catch (error) {
        return serverError('resend-verification', error)
      }
    })
    .post('/v1/auth/forgot-password', async (c) => {
      const body = await parseJson(c.req.raw, forgotPasswordRequestSchema)
      if (body instanceof Response) return body

      try {
        await passwordReset.request(body.email)
      } catch (error) {
        logger.error('handler failed', { scope: 'forgot-password', error: serializeError(error) })
      }
      return ok<OkResponse>({ ok: true })
    })
    .get('/v1/auth/reset-password', async (c) => {
      const oobCode = c.req.query('oobCode')
      if (!oobCode) return badRequest('Missing token')

      try {
        const { email } = await passwordReset.validate(oobCode)
        return ok<PasswordResetEmailResponse>({ ok: true, email })
      } catch (error) {
        return failure('reset-password:GET', error)
      }
    })
    .post('/v1/auth/reset-password', async (c) => {
      const body = await parseJson(c.req.raw, resetPasswordRequestSchema)
      if (body instanceof Response) return body

      try {
        const { email } = await passwordReset.reset(body)
        return ok<PasswordResetEmailResponse>({ ok: true, email })
      } catch (error) {
        return failure('reset-password:POST', error)
      }
    })
}
