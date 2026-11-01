import { type ChangeUsernameResponse, changeUsernameSchema, type UsernameAvailability } from '@nexustimer/contracts'
import { Hono, type MiddlewareHandler } from 'hono'
import type { UserEnv } from '../../http/require-user'
import { conflict, notFound, ok, serverError, tooManyRequests } from '../../http/responses'
import type { AppEnv } from '../../http/types'
import { parseJson } from '../../http/validation'
import type { UsernamesService } from './usernames.service'

export function usernamesRoutes(usernames: UsernamesService, signedIn: MiddlewareHandler<UserEnv>) {
  return new Hono<AppEnv>()
    .get('/username-availability', signedIn, async (c) => {
      try {
        const result = await usernames.availability(c.var.userId, c.req.query('u') ?? '')
        if (result === 'rate-limited') return tooManyRequests()
        return ok<UsernameAvailability>(result)
      } catch (error) {
        return serverError('users/username-availability:GET', error)
      }
    })
    .put('/username', signedIn, async (c) => {
      const body = await parseJson(c.req.raw, changeUsernameSchema)
      if (body instanceof Response) return body

      try {
        const result = await usernames.change(c.var.userId, body.username)
        if (result === 'rate-limited') return tooManyRequests()
        if (result === 'not_found') return notFound('User not found')
        if (result === 'taken' || result === 'locked') return conflict(result)
        return ok<ChangeUsernameResponse>(result)
      } catch (error) {
        return serverError('users/username:PUT', error)
      }
    })
}
