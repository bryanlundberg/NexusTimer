import { normalizeNexiRecipe, randomNexiRecipe, renderNexiWebp, NEXI_IMAGE_TYPE } from '@nexustimer/avatars/node'
import type { AvatarUploadResponse, NexiRecipe } from '@nexustimer/contracts'
import type { Storage } from '../../infra/storage'
import type { UsersService } from '../users/users.service'
import { avatarKey, versionedUrl } from './avatars.service'
import type { NexiQuota } from './nexi.quota'

export type NexiAvatarsService = {
  save(userId: string, recipe: NexiRecipe): Promise<AvatarUploadResponse | 'rate-limited' | null>
  createForNewUser(userId: string): Promise<string>
}

type NexiDeps = {
  storage: Storage
  users: Pick<UsersService, 'setImage'>
  quota: NexiQuota
  render?: (recipe: NexiRecipe) => Promise<Uint8Array>
  now?: () => number
}

export function createNexiAvatarsService({
  storage,
  users,
  quota,
  render = renderNexiWebp,
  now = () => Date.now()
}: NexiDeps): NexiAvatarsService {
  async function store(userId: string, recipe: NexiRecipe) {
    const key = avatarKey(userId)
    await storage.upload(key, await render(recipe), { contentType: NEXI_IMAGE_TYPE })
    return { key, url: versionedUrl(storage, key, now()) }
  }

  return {
    async save(userId, recipe) {
      if (!(await quota.consume(userId))) return 'rate-limited'

      const { key, url } = await store(userId, normalizeNexiRecipe(recipe))
      return (await users.setImage(userId, url)) ? { url, public_id: key } : null
    },

    async createForNewUser(userId) {
      return (await store(userId, randomNexiRecipe(userId))).url
    }
  }
}
