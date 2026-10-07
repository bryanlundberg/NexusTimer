import type { AvatarUploadResponse } from '@nexustimer/contracts'
import type { Storage } from '../../infra/storage'
import type { UsersService } from '../users/users.service'

export const MAX_AVATAR_BYTES = 2 * 1024 * 1024

export type AvatarFile = { bytes: Uint8Array; type: string }

const ascii = (text: string) => [...text].map((char) => char.charCodeAt(0))

const hasBytes = (bytes: Uint8Array, signature: number[], offset = 0) =>
  signature.every((byte, index) => bytes[offset + index] === byte)

export function detectImageType(bytes: Uint8Array): string | null {
  if (hasBytes(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'image/png'
  if (hasBytes(bytes, [0xff, 0xd8, 0xff])) return 'image/jpeg'
  if (hasBytes(bytes, ascii('GIF87a')) || hasBytes(bytes, ascii('GIF89a'))) return 'image/gif'
  if (hasBytes(bytes, ascii('RIFF')) && hasBytes(bytes, ascii('WEBP'), 8)) return 'image/webp'
  return null
}

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
