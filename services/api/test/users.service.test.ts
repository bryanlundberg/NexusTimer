import { describe, expect, it } from 'vitest'
import { createProfileCache } from '../src/modules/users/users.cache'
import type { UsersRepository } from '../src/modules/users/users.repository'
import { createUsersService } from '../src/modules/users/users.service'
import { fakeRedis } from './fake-redis'

describe('users service', () => {
  it('reads cached profiles first, keeps only public fields and asks the database for the rest', async () => {
    const redis = fakeRedis()
    redis.strings.set(
      'user:profile:u1',
      JSON.stringify({ _id: 'u1', name: 'Ana', image: 'a.png', email: 'ana@private.test', country: 'MX', bio: 'hi' })
    )
    const asked: string[][] = []
    const repository: UsersRepository = {
      async findPublicProfiles(ids) {
        asked.push(ids)
        return ids.map((id) => ({ _id: id, name: `name ${id}`, image: `${id}.png` }))
      }
    }

    const profiles = await createUsersService(repository, createProfileCache(redis.provider)).publicProfiles([
      'u1',
      'u2',
      'u2'
    ])

    expect(profiles.get('u1')).toEqual({ _id: 'u1', name: 'Ana', image: 'a.png', country: 'MX' })
    expect(profiles.get('u2')).toEqual({ _id: 'u2', name: 'name u2', image: 'u2.png' })
    expect(asked).toEqual([['u2']])
  })

  it('falls back to the database when Redis is down', async () => {
    const redis = fakeRedis()
    redis.state.down = true
    const repository: UsersRepository = {
      findPublicProfiles: async (ids) => ids.map((id) => ({ _id: id, name: id, image: '' }))
    }

    const profiles = await createUsersService(repository, createProfileCache(redis.provider)).publicProfiles(['u1'])

    expect([...profiles.keys()]).toEqual(['u1'])
  })
})
