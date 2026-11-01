import {
  type ChangeUsernameResponse,
  normalizeUsername,
  type UsernameAvailability,
  type UsernameChangeError,
  usernameIssue
} from '@nexustimer/contracts'
import type { UsersService } from '../users/users.service'
import type { UsernameLimits } from './usernames.limits'
import type { UsernamesRepository } from './usernames.repository'

export type ChangeUsernameResult = ChangeUsernameResponse | UsernameChangeError | 'not_found' | 'rate-limited'

export type UsernamesService = {
  availability(userId: string, input: string): Promise<UsernameAvailability | 'rate-limited'>
  change(userId: string, username: string): Promise<ChangeUsernameResult>
}

type UsernamesDeps = {
  repository: UsernamesRepository
  limits: UsernameLimits
  users: Pick<UsersService, 'forgetProfile'>
  now?: () => number
}

export function createUsernamesService({ repository, limits, users, now = Date.now }: UsernamesDeps): UsernamesService {
  async function takenByOther(userId: string, username: string) {
    const holder = await repository.holder(username)
    return holder !== null && holder !== userId
  }

  return {
    async availability(userId, input) {
      if (!(await limits.consume(userId))) return 'rate-limited'

      const username = normalizeUsername(input)
      const issue = usernameIssue(username)
      if (issue) return { available: false, issue }
      if (await takenByOther(userId, username)) return { available: false, issue: 'taken' }
      return { available: true, issue: null }
    },

    async change(userId, username) {
      if (!(await limits.consume(userId))) return 'rate-limited'

      if (await takenByOther(userId, username)) return 'taken'

      const at = now()
      const result = await repository.change(userId, username, at)
      if (result === 'changed') {
        await users.forgetProfile(userId)
        return { username, usernameChangedAt: at }
      }
      if (result === 'unchanged') {
        const changedAt = await repository.changedAt(userId)
        return changedAt === undefined ? 'not_found' : { username, usernameChangedAt: changedAt }
      }
      return result
    }
  }
}
