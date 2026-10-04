import type { PublicUser } from '@nexustimer/contracts'
import type { ProfileCache } from './users.cache'
import type { UsersRepository } from './users.repository'

export type UsersService = {
  publicProfiles(ids: string[]): Promise<Map<string, PublicUser>>
}

export function createUsersService(repository: UsersRepository, cache: ProfileCache): UsersService {
  return {
    async publicProfiles(ids) {
      const unique = [...new Set(ids)]
      const profiles = await cache.getMany(unique)
      const missing = unique.filter((id) => !profiles.has(id))

      for (const user of await repository.findPublicProfiles(missing)) profiles.set(user._id, user)
      return profiles
    }
  }
}
