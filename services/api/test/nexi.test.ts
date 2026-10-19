import { DEFAULT_NEXI_RECIPE, randomNexiRecipe } from '@nexustimer/avatars'
import type { NexiRecipe } from '@nexustimer/contracts'
import { describe, expect, it, vi } from 'vitest'
import { createNexiAvatarsService, type NexiAvatarsService } from '../src/modules/avatars/nexi.service'
import { buildTestApp, testSessions } from './helpers'
import { fakeStorage } from './storage-fakes'

const USER = '64b7f0c2a1b2c3d4e5f60718'
const URL = `https://files.test/avatars/${USER}?v=1234`
const CUSTOM: NexiRecipe = { ...DEFAULT_NEXI_RECIPE, shape: 'pyraminx', head: 'headset', hand: 'cube', bg: '#5a2d9c' }

const unused = () => Promise.reject(new Error('not used'))

function appWith(nexi: Partial<NexiAvatarsService>, userId: string | null = USER) {
  return buildTestApp({
    sessions: testSessions(userId),
    nexi: { save: unused, createForNewUser: unused, ...nexi }
  })
}

const put = (body: unknown) => ({
  method: 'PUT',
  body: typeof body === 'string' ? body : JSON.stringify(body),
  headers: { 'content-type': 'application/json' }
})

function serviceWith({ found = true, allowed = true }: { found?: boolean; allowed?: boolean } = {}) {
  const { storage, objects } = fakeStorage()
  const setImage = vi.fn(async () => found)
  const render = vi.fn(async (recipe: NexiRecipe) => new TextEncoder().encode(JSON.stringify(recipe)))
  const nexi = createNexiAvatarsService({
    storage,
    users: { setImage },
    quota: { consume: async () => allowed },
    render,
    now: () => 1234
  })
  return { nexi, objects, setImage, render }
}

describe('nexi routes', () => {
  it('answers 401 without a session', async () => {
    const app = appWith({}, null)
    expect((await app.request('/api/v1/users/avatar/nexi', put(CUSTOM))).status).toBe(401)
  })

  it('has no recipe to read back', async () => {
    expect((await appWith({}).request('/api/v1/users/avatar/nexi')).status).toBe(404)
  })

  it.each([
    ['malformed json', '{'],
    ['an unknown head', { ...CUSTOM, head: 'balloon' }],
    ['a missing field', { ...CUSTOM, shape: undefined }],
    ['a named color', { ...CUSTOM, color: 'red' }],
    ['another version', { ...CUSTOM, v: 2 }]
  ])('rejects %s', async (_, body) => {
    const save = vi.fn<NexiAvatarsService['save']>()
    const res = await appWith({ save }).request('/api/v1/users/avatar/nexi', put(body))

    expect(res.status).toBe(400)
    expect(save).not.toHaveBeenCalled()
  })

  it('saves a valid recipe', async () => {
    const save = vi.fn<NexiAvatarsService['save']>(async () => ({ url: URL, public_id: `avatars/${USER}` }))
    const res = await appWith({ save }).request('/api/v1/users/avatar/nexi', put(CUSTOM))

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ url: URL, public_id: `avatars/${USER}` })
    expect(save).toHaveBeenCalledWith(USER, CUSTOM)
  })

  it('answers 429 when the quota runs out and 404 for a missing user', async () => {
    expect(
      (await appWith({ save: async () => 'rate-limited' }).request('/api/v1/users/avatar/nexi', put(CUSTOM))).status
    ).toBe(429)
    expect((await appWith({ save: async () => null }).request('/api/v1/users/avatar/nexi', put(CUSTOM))).status).toBe(
      404
    )
  })
})

describe('nexi avatars service', () => {
  it('renders, uploads over the photo key and saves only the image', async () => {
    const { nexi, objects, setImage, render } = serviceWith()

    const result = await nexi.save(USER, { ...CUSTOM, color: '#5B63F5' })

    expect(result).toEqual({ url: URL, public_id: `avatars/${USER}` })
    expect(render).toHaveBeenCalledWith({ ...CUSTOM, color: '#5b63f5' })
    expect(objects.get(`avatars/${USER}`)).toMatchObject({ options: { contentType: 'image/webp' } })
    expect(setImage).toHaveBeenCalledWith(USER, URL)
  })

  it('does nothing when the quota runs out', async () => {
    const { nexi, objects, render, setImage } = serviceWith({ allowed: false })

    expect(await nexi.save(USER, CUSTOM)).toBe('rate-limited')
    expect(render).not.toHaveBeenCalled()
    expect(objects.size).toBe(0)
    expect(setImage).not.toHaveBeenCalled()
  })

  it('answers null when the user is gone', async () => {
    expect(await serviceWith({ found: false }).nexi.save(USER, CUSTOM)).toBeNull()
  })

  it('creates the signup avatar from the user id', async () => {
    const { nexi, objects, render, setImage } = serviceWith()

    expect(await nexi.createForNewUser(USER)).toBe(URL)
    expect(render).toHaveBeenCalledWith(randomNexiRecipe(USER))
    expect(objects.has(`avatars/${USER}`)).toBe(true)
    expect(setImage).not.toHaveBeenCalled()
  })

  it('uploads a real WebP by default', async () => {
    const { storage, objects } = fakeStorage()
    const nexi = createNexiAvatarsService({
      storage,
      users: { setImage: async () => true },
      quota: { consume: async () => true }
    })

    await nexi.save(USER, CUSTOM)

    const body = objects.get(`avatars/${USER}`)?.body ?? new Uint8Array()
    expect(String.fromCharCode(...body.subarray(0, 4), ...body.subarray(8, 12))).toBe('RIFFWEBP')
  })
})
