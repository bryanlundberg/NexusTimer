import { betterAuth } from 'better-auth'
import { memoryAdapter } from 'better-auth/adapters/memory'
import { describe, expect, it, vi } from 'vitest'
import { signupUserHook } from '../src/modules/auth/auth'

vi.mock('../src/modules/logs/logs.service', () => ({ recordLog: vi.fn(async () => {}) }))

const OBJECT_ID = /^[0-9a-f]{24}$/

describe('signup avatar hook', () => {
  it('gives the new user an id and the Nexi uploaded for it', async () => {
    const createForNewUser = vi.fn(async (userId: string) => `https://files.test/avatars/${userId}?v=1`)

    const { data } = await signupUserHook({ createForNewUser })({ name: 'Ana', email: 'ana@test.dev' })

    expect(data.id).toMatch(OBJECT_ID)
    expect(createForNewUser).toHaveBeenCalledWith(data.id)
    expect(data.image).toBe(`https://files.test/avatars/${data.id}?v=1`)
    expect(data).toMatchObject({ name: 'Ana', email: 'ana@test.dev' })
  })

  it('replaces the provider photo', async () => {
    const hook = signupUserHook({ createForNewUser: async () => 'https://files.test/nexi' })

    expect((await hook({ image: 'https://lh3.googleusercontent.com/photo' })).data.image).toBe(
      'https://files.test/nexi'
    )
  })

  it('never falls back to the provider photo when generation fails', async () => {
    const hook = signupUserHook({ createForNewUser: async () => Promise.reject(new Error('storage down')) })

    expect((await hook({ image: 'https://lh3.googleusercontent.com/photo' })).data.image).toBe('')
    expect((await hook({ image: null })).data.image).toBe('')
    expect((await hook({})).data.id).toMatch(OBJECT_ID)
  })

  it('creates the user with the id the avatar was uploaded under', async () => {
    const uploaded: string[] = []
    const auth = betterAuth({
      baseURL: 'http://localhost:3000',
      secret: 'test-better-auth-secret-0123456789',
      database: memoryAdapter({ user: [], session: [], account: [], verification: [] }),
      databaseHooks: {
        user: {
          create: {
            before: signupUserHook({
              createForNewUser: async (userId) => {
                uploaded.push(userId)
                return `https://files.test/avatars/${userId}`
              }
            })
          }
        }
      }
    })

    const { internalAdapter } = await auth.$context
    const user = await internalAdapter.createUser(
      { email: 'ana@test.dev', name: 'Ana', emailVerified: true },
      { method: 'email-password' }
    )

    expect(uploaded).toEqual([user.id])
    expect(user.image).toBe(`https://files.test/avatars/${user.id}`)
    expect((await internalAdapter.findUserById(user.id))?.image).toBe(user.image)
  })
})
