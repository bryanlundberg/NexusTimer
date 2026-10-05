import { type PrivacySettings, updatePrivacySchema } from '@nexustimer/contracts'
import { Hono, type MiddlewareHandler } from 'hono'
import type { UserEnv } from '../../http/require-user'
import { badRequest, ok, serverError } from '../../http/responses'
import type { AppEnv } from '../../http/types'
import { parseJson } from '../../http/validation'
import type { UsersService } from './users.service'

export type PrivacyService = Pick<UsersService, 'privacy' | 'updatePrivacy'>

export function privacyRoutes(users: PrivacyService, signedIn: MiddlewareHandler<UserEnv>) {
  return new Hono<AppEnv>()
    .get('/', signedIn, async (c) => {
      try {
        return ok<PrivacySettings>(await users.privacy(c.var.userId))
      } catch (error) {
        return serverError('privacy:GET', error)
      }
    })
    .patch('/', signedIn, async (c) => {
      const body = await parseJson(c.req.raw, updatePrivacySchema)
      if (body instanceof Response) return body
      if (Object.values(body).every((value) => value === undefined)) return badRequest('Nothing to update')

      try {
        return ok<PrivacySettings>(await users.updatePrivacy(c.var.userId, body))
      } catch (error) {
        return serverError('privacy:PATCH', error)
      }
    })
}
