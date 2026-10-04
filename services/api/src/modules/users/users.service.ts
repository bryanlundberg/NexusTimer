import type { PublicUser } from '@nexustimer/contracts'
import type { UsersRepository } from './users.repository'

export type UsersService = {
  publicProfiles(ids: string[]): Promise<Map<string, PublicUser>>
}

export function createUsersService(repository: UsersRepository): UsersService {
  return {
    async publicProfiles(ids) {
      const users = await repository.findPublicProfiles([...new Set(ids)])
      return new Map(users.map((user) => [user._id, user]))
    }
  }
}
