import { describe, expect, it, vi } from 'vitest'
import type { AvatarsService } from '../src/modules/avatars/avatars.service'
import { createAvatarsService } from '../src/modules/avatars/avatars.service'
import type { BackupsService } from '../src/modules/backups/backups.service'
import { buildTestApp, testSessions } from './helpers'
import { fakeStorage } from './storage-fakes'

const USER = '64b7f0c2a1b2c3d4e5f60718'
const current = { url: 'https://files.test/backups/u/20261004T100000Z.json', updatedAt: 1_759_572_000_000 }

const unused = () => Promise.reject(new Error('not used'))

function appWith(
  { backups = {}, avatars = {} }: { backups?: Partial<BackupsService>; avatars?: Partial<AvatarsService> },
  userId: string | null = USER
) {
  return buildTestApp({
    sessions: testSessions(userId),
    backups: { upload: unused, list: unused, remove: unused, ...backups },
    avatars: { upload: unused, ...avatars }
  })
}

const post = (body: RequestInit['body'], headers: Record<string, string> = {}) => ({ method: 'POST', body, headers })

describe('backups routes', () => {
  it('answers 401 without a session', async () => {
    const app = appWith({}, null)

    expect((await app.request('/api/v1/backups', post('[]'))).status).toBe(401)
    expect((await app.request('/api/v1/backups')).status).toBe(401)
    expect((await app.request('/api/v1/backups?file=a.json', { method: 'DELETE' })).status).toBe(401)
    expect((await app.request('/api/v1/users/avatar', post(new FormData()))).status).toBe(401)
  })

  it('passes the raw body and the timezone header, and answers the new current backup', async () => {
    const upload = vi.fn<BackupsService['upload']>(async () => ({ backup: current }))

    const res = await appWith({ backups: { upload } }).request(
      '/api/v1/backups',
      post(new Uint8Array([0x1f, 0x8b, 1]), { 'X-Timezone': 'Europe/Madrid' })
    )

    expect(await res.json()).toEqual(current)
    expect(upload).toHaveBeenCalledWith(USER, new Uint8Array([0x1f, 0x8b, 1]), 'Europe/Madrid')
  })

  it('keeps the v1 statuses for each payload problem', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const cases = [
      ['malformed', 400, { message: 'Malformed backup payload' }],
      ['not-json', 400, { message: 'Backup is not valid JSON' }],
      ['user-not-found', 404, { message: 'User not found' }],
      ['empty-body', 500, { message: 'Internal server error' }],
      ['empty-backup', 500, { message: 'Internal server error' }],
      ['too-large', 500, { message: 'Internal server error' }]
    ] as const

    for (const [error, status, body] of cases) {
      const res = await appWith({ backups: { upload: async () => ({ error }) } }).request('/api/v1/backups', post('x'))
      expect(res.status).toBe(status)
      expect(await res.json()).toEqual(body)
    }
  })

  it('lists my backups', async () => {
    const backups = [{ id: 'a.json', createdAt: 1, size: 2, url: 'https://files.test/a.json', isCurrent: true }]

    const res = await appWith({ backups: { list: async () => backups } }).request('/api/v1/backups')

    expect(await res.json()).toEqual(backups)
  })

  it('checks the file name before deleting and answers 404 for a missing backup', async () => {
    const remove = vi.fn<BackupsService['remove']>(async (_, file) =>
      file === 'gone.json' ? null : { deleted: file, current: null }
    )
    const app = appWith({ backups: { remove } })

    const missingParam = await app.request('/api/v1/backups', { method: 'DELETE' })
    const traversal = await app.request('/api/v1/backups?file=..%2Fother%2Fx.json', { method: 'DELETE' })
    const gone = await app.request('/api/v1/backups?file=gone.json', { method: 'DELETE' })
    const deleted = await app.request('/api/v1/backups?file=20261004T100000Z.json', { method: 'DELETE' })

    expect(missingParam.status).toBe(400)
    expect(await traversal.json()).toEqual({ message: 'Invalid backup file' })
    expect(gone.status).toBe(404)
    expect(await gone.json()).toEqual({ message: 'Backup not found' })
    expect(await deleted.json()).toEqual({ deleted: '20261004T100000Z.json', current: null })
    expect(remove.mock.calls.map((call) => call[1])).toEqual(['gone.json', '20261004T100000Z.json'])
  })
})

describe('avatar route', () => {
  const form = (file: Blob | string | null, name = 'avatar.webp') => {
    const data = new FormData()
    if (typeof file === 'string') data.append('file', file)
    else if (file) data.append('file', file, name)
    return data
  }

  it('validates the uploaded file', async () => {
    const upload = vi.fn<AvatarsService['upload']>()
    const app = appWith({ avatars: { upload } })
    const send = async (file: Blob | string | null) => {
      const res = await app.request('/api/v1/users/avatar', post(form(file)))
      return [res.status, await res.json()]
    }

    expect(await send(null)).toEqual([400, { message: 'No file provided' }])
    expect(await send('not a file')).toEqual([400, { message: 'No file provided' }])
    expect(await send(new Blob([], { type: 'image/webp' }))).toEqual([400, { message: 'Empty file' }])
    expect(await send(new Blob([new Uint8Array(2 * 1024 * 1024 + 1)], { type: 'image/webp' }))).toEqual([
      400,
      { message: 'File too large' }
    ])
    expect(await send(new Blob(['hi'], { type: 'text/plain' }))).toEqual([400, { message: 'Invalid file type' }])
    expect(upload).not.toHaveBeenCalled()
  })

  it('stores the image under the user and answers a cache busting url', async () => {
    const { storage, objects } = fakeStorage()
    const setImage = vi.fn(async () => true)
    const avatars = createAvatarsService({ storage, users: { setImage }, now: () => 1234 })

    const res = await appWith({ avatars }).request(
      '/api/v1/users/avatar',
      post(form(new Blob([new Uint8Array([1, 2, 3])], { type: 'image/webp' })))
    )

    expect(await res.json()).toEqual({ url: `https://files.test/avatars/${USER}?v=1234`, public_id: `avatars/${USER}` })
    expect(objects.get(`avatars/${USER}`)).toMatchObject({
      body: new Uint8Array([1, 2, 3]),
      options: { contentType: 'image/webp' }
    })
    expect(setImage).toHaveBeenCalledWith(USER, `https://files.test/avatars/${USER}?v=1234`)
  })

  it('appends the version to a url that already has a query and answers 404 for a missing user', async () => {
    const { storage } = fakeStorage()
    const signed = { ...storage, url: (key: string) => `https://files.test/${key}?token=abc` }
    const avatars = createAvatarsService({ storage: signed, users: { setImage: async () => false }, now: () => 1 })

    expect(await avatars.upload(USER, { bytes: new Uint8Array([1]), type: 'image/png' })).toBeNull()

    const found = createAvatarsService({ storage: signed, users: { setImage: async () => true }, now: () => 1 })
    expect(await found.upload(USER, { bytes: new Uint8Array([1]), type: 'image/png' })).toEqual({
      url: `https://files.test/avatars/${USER}?token=abc&v=1`,
      public_id: `avatars/${USER}`
    })

    const res = await appWith({ avatars }).request(
      '/api/v1/users/avatar',
      post(form(new Blob([new Uint8Array([1])], { type: 'image/png' })))
    )
    expect(res.status).toBe(404)
  })
})
