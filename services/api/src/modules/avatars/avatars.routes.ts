import type { AvatarUploadResponse } from '@nexustimer/contracts'
import { Hono, type MiddlewareHandler } from 'hono'
import type { UserEnv } from '../../http/require-user'
import { badRequest, notFound, ok, serverError } from '../../http/responses'
import type { AppEnv } from '../../http/types'
import { type AvatarsService, MAX_AVATAR_BYTES } from './avatars.service'

export function avatarsRoutes(avatars: AvatarsService, signedIn: MiddlewareHandler<UserEnv>) {
  return new Hono<AppEnv>().post('/avatar', signedIn, async (c) => {
    try {
      const file = (await c.req.raw.formData()).get('file')

      if (!(file instanceof File)) return badRequest('No file provided')
      if (file.size === 0) return badRequest('Empty file')
      if (file.size > MAX_AVATAR_BYTES) return badRequest('File too large')
      if (!file.type.startsWith('image/')) return badRequest('Invalid file type')

      const result = await avatars.upload(c.var.userId, {
        bytes: new Uint8Array(await file.arrayBuffer()),
        type: file.type
      })
      return result ? ok<AvatarUploadResponse>(result) : notFound('User not found')
    } catch (error) {
      return serverError('users/avatar:POST', error)
    }
  })
}
