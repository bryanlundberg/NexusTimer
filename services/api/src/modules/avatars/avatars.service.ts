import type { AvatarUploadResponse } from '@nexustimer/contracts'
import type { Storage } from '../../infra/storage'
import type { UsersService } from '../users/users.service'

export const MAX_AVATAR_BYTES = 2 * 1024 * 1024

export type AvatarFile = { bytes: Uint8Array; type: string }

export type AvatarsService = {
  upload(userId: string, file: AvatarFile): Promise<AvatarUploadResponse | null>
}

type AvatarsDeps = {
  storage: Storage
  users: Pick<UsersService, 'setImage'>
  now?: () => number
}

const avatarKey = (userId: string) => `avatars/${userId}`

export function createAvatarsService({ storage, users, now = () => Date.now() }: AvatarsDeps): AvatarsService {
  return {
    async upload(userId, { bytes, type }) {
      const key = avatarKey(userId)
      await storage.upload(key, bytes, { contentType: type })

      const baseUrl = storage.url(key)
      const url = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}v=${now()}`

      return (await users.setImage(userId, url)) ? { url, public_id: key } : null
    }
  }
}
