import { type AvatarUploadResponse, nexiRecipeSchema } from '@nexustimer/contracts'
import { Hono, type MiddlewareHandler } from 'hono'
import type { UserEnv } from '../../http/require-user'
import { notFound, ok, serverError, tooManyRequests } from '../../http/responses'
import type { AppEnv } from '../../http/types'
import { parseJson } from '../../http/validation'
import type { NexiAvatarsService } from './nexi.service'

export function nexiRoutes(nexi: NexiAvatarsService, signedIn: MiddlewareHandler<UserEnv>) {
  return new Hono<AppEnv>().put('/avatar/nexi', signedIn, async (c) => {
    try {
      const recipe = await parseJson(c.req.raw, nexiRecipeSchema)
      if (recipe instanceof Response) return recipe

      const result = await nexi.save(c.var.userId, recipe)
      if (result === 'rate-limited') return tooManyRequests('Too many avatar changes, try again later')
      return result ? ok<AvatarUploadResponse>(result) : notFound('User not found')
    } catch (error) {
      return serverError('users/avatar/nexi:PUT', error)
    }
  })
}
