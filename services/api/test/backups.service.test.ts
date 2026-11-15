import { gzipSync } from 'node:zlib'
import type { CurrentBackup, RealtimeEvent } from '@nexustimer/contracts'
import { describe, expect, it, vi } from 'vitest'
import type { StatsSnapshot } from '../src/modules/users/users.repository'
import { createBackupsService, decodeBackup, MAX_BACKUP_BYTES } from '../src/modules/backups/backups.service'
import { fakeStorage } from './storage-fakes'

const USER = '64b7f0c2a1b2c3d4e5f60718'
const T0 = Date.UTC(2026, 9, 4, 10, 0, 0)
const SUFFIX = 'a1b2c3'

const name = (time: string) => `${time}-${SUFFIX}.json`

const solve = (id: string, time: number, startTime: number) => ({
  id,
  cubeId: 'c1',
  scramble: "R U R' U'",
  startTime,
  endTime: startTime + time,
  bookmark: false,
  time,
  rating: 0,
  dnf: false,
  plus2: false
})

const backupJson = JSON.stringify([
  {
    id: 'c1',
    name: 'Main',
    category: '3x3',
    createdAt: T0,
    favorite: false,
    solves: { session: [solve('s1', 9000, T0), solve('s2', 11000, T0 + 60_000)], all: [] }
  }
])

function setup({ userExists = true, fixedSuffix = true } = {}) {
  const { storage, objects } = fakeStorage()
  const state: {
    backup: CurrentBackup | null
    stats: StatsSnapshot[]
    invalidated: string[]
    published: { userId: string; event: RealtimeEvent }[]
  } = {
    backup: null,
    stats: [],
    invalidated: [],
    published: []
  }
  const tasks: Promise<unknown>[] = []
  const failures: unknown[] = []
  let clock = T0

  const service = createBackupsService({
    storage,
    users: {
      backup: async () => state.backup,
      async setBackup(_, backup) {
        if (userExists) state.backup = backup
        return userExists
      },
      async saveStats(_, stats) {
        state.stats.push(stats)
      }
    },
    bests: {
      async invalidate(userId) {
        state.invalidated.push(userId)
      }
    },
    realtime: {
      async toUser(userId, event) {
        state.published.push({ userId, event })
      }
    },
    background: (_scope, task) => {
      tasks.push(task().catch((error: unknown) => failures.push(error)))
    },
    now: () => (clock += 1000),
    ...(fixedSuffix && { randomSuffix: () => SUFFIX })
  })

  const settle = () => Promise.all(tasks.splice(0))
  return { service, objects, state, settle, failures }
}

const bytes = (text: string) => new TextEncoder().encode(text)

describe('decodeBackup', () => {
  it('reads plain and gzip bodies', () => {
    expect(decodeBackup(bytes('[]'))).toMatchObject({ backup: [] })
    expect(decodeBackup(gzipSync('[1]'))).toMatchObject({ backup: [1] })
  })

  it('names what is wrong with the payload', () => {
    expect(decodeBackup(new Uint8Array())).toEqual({ error: 'empty-body' })
    expect(decodeBackup(new Uint8Array([0x1f, 0x8b, 1, 2, 3]))).toEqual({ error: 'malformed' })
    expect(decodeBackup(gzipSync(''))).toEqual({ error: 'empty-backup' })
    expect(decodeBackup(bytes('{nope'))).toEqual({ error: 'not-json' })
  })

  it('stops at 32 MB, compressed or not', () => {
    const big = Buffer.alloc(MAX_BACKUP_BYTES + 1, 0x20)

    expect(decodeBackup(big)).toEqual({ error: 'too-large' })
    expect(decodeBackup(gzipSync(big))).toEqual({ error: 'too-large' })
  })
})

describe('backups service', () => {
  it('stores the backup as immutable JSON, points the user at it and computes stats in the background', async () => {
    const { service, objects, state, settle } = setup()

    const result = await service.upload(USER, gzipSync(backupJson), 'America/Mexico_City')
    await settle()

    const key = `backups/${USER}/${name('20261004T100001Z')}`
    expect(result).toEqual({ backup: { url: `https://files.test/${key}`, updatedAt: T0 + 1000 } })
    expect(state.backup).toEqual({ url: `https://files.test/${key}`, updatedAt: T0 + 1000 })
    expect(new TextDecoder().decode(objects.get(key)!.body)).toBe(backupJson)
    expect(objects.get(key)!.options).toEqual({
      contentType: 'application/json',
      cacheControl: 'public, max-age=31536000, immutable'
    })
    expect(state.stats).toHaveLength(1)
    expect(state.stats[0]).toMatchObject({
      backupUpdatedAt: T0 + 1000,
      summary: { timezone: 'America/Mexico_City', totalSolves: 2, categories: [{ category: '3x3', count: 2 }] }
    })
    expect(state.invalidated).toEqual([USER])
  })

  it('names each backup after its time plus a random suffix nobody can guess', async () => {
    const { service, objects } = setup({ fixedSuffix: false })

    await service.upload(USER, bytes('[]'), null)
    await service.upload(USER, bytes('[]'), null)

    const files = [...objects.keys()].map((key) => key.slice(`backups/${USER}/`.length))
    expect(files).toEqual([
      expect.stringMatching(/^20261004T100001Z-[0-9a-f]{32}\.json$/),
      expect.stringMatching(/^20261004T100002Z-[0-9a-f]{32}\.json$/)
    ])
    expect(new Set(files.map((file) => file.slice('20261004T100001Z-'.length))).size).toBe(2)
  })

  it('uses a valid client suffix so the uploading device knows its backup', async () => {
    const { service, objects } = setup({ fixedSuffix: false })
    const suffix = 'c0ffee'.padEnd(32, '0')

    await service.upload(USER, bytes('[]'), null, suffix)

    expect([...objects.keys()]).toEqual([`backups/${USER}/20261004T100001Z-${suffix}.json`])
  })

  it('ignores a malformed client suffix and never overwrites an existing file', async () => {
    const { service, objects } = setup()
    const suffix = 'f'.repeat(32)
    objects.set(`backups/${USER}/20261004T100002Z-${suffix}.json`, {
      body: bytes('old'),
      options: { contentType: 'application/json' },
      lastModified: T0
    })

    await service.upload(USER, bytes('[]'), null, '../../evil')
    await service.upload(USER, bytes('[]'), null, suffix)

    expect([...objects.keys()].sort()).toEqual([
      `backups/${USER}/${name('20261004T100001Z')}`,
      `backups/${USER}/${name('20261004T100002Z')}`,
      `backups/${USER}/20261004T100002Z-${suffix}.json`
    ])
    expect(new TextDecoder().decode(objects.get(`backups/${USER}/20261004T100002Z-${suffix}.json`)!.body)).toBe('old')
  })

  it('tells the user devices about a stored backup, and only about stored ones', async () => {
    const { service, state } = setup()

    const result = await service.upload(USER, bytes('[]'), null)
    await service.upload(USER, bytes('nope'), null)
    const gone = setup({ userExists: false })
    await gone.service.upload(USER, bytes('[]'), null)

    expect(state.published).toEqual([{ userId: USER, event: { type: 'backup:updated', backup: state.backup } }])
    expect('backup' in result && result.backup).toEqual(state.backup)
    expect(gone.state.published).toEqual([])
  })

  it('answers the current backup pointer', async () => {
    const { service, state } = setup()
    expect(await service.current(USER)).toBeNull()

    await service.upload(USER, bytes('[]'), null)

    expect(await service.current(USER)).toEqual(state.backup)
  })

  it('keeps the upload when the stats task fails on an unexpected shape', async () => {
    const { service, state, settle, failures } = setup()

    const result = await service.upload(USER, bytes('[1]'), null)
    await settle()

    expect(result).toHaveProperty('backup')
    expect(state.backup).not.toBeNull()
    expect(failures).toHaveLength(1)
    expect(state.stats).toEqual([])
  })

  it('falls back to UTC stats for a missing or invalid timezone', async () => {
    const { service, state, settle } = setup()

    await service.upload(USER, bytes(backupJson), null)
    await service.upload(USER, bytes(backupJson), 'Mars/Olympus')
    await settle()

    expect(state.stats.map((stats) => stats.summary.timezone)).toEqual(['UTC', 'UTC'])
  })

  it('keeps the ten newest backups', async () => {
    const { service, objects, settle } = setup()

    for (let i = 0; i < 12; i++) {
      await service.upload(USER, bytes('[]'), null)
      await settle()
    }

    const kept = [...objects.keys()].sort()
    expect(kept).toHaveLength(10)
    expect(kept[0]).toBe(`backups/${USER}/${name('20261004T100003Z')}`)
  })

  it('reports a missing user after the upload and rejects bad payloads before it', async () => {
    const gone = setup({ userExists: false })
    expect(await gone.service.upload(USER, bytes('[]'), null)).toEqual({ error: 'user-not-found' })

    const bad = setup()
    expect(await bad.service.upload(USER, bytes('nope'), null)).toEqual({ error: 'not-json' })
    expect(bad.objects.size).toBe(0)
  })

  it('queues the whole upload in the background and logs a rejected payload', async () => {
    const queued = setup()
    queued.service.queueUpload(USER, bytes(backupJson), null)
    expect(queued.state.backup).toBeNull()
    await queued.settle()
    await queued.settle()
    expect(queued.state.backup?.url).toContain(name('20261004T100001Z'))
    expect(queued.state.stats).toHaveLength(1)

    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const bad = setup()
    bad.service.queueUpload(USER, bytes('nope'), null)
    await bad.settle()
    expect(bad.objects.size).toBe(0)
    expect(String(log.mock.calls[0]?.[0])).toContain('not-json')
  })

  it('lists backups newest first and flags the current one', async () => {
    const { service, settle } = setup()
    await service.upload(USER, bytes('[]'), null)
    await service.upload(USER, bytes('[ ]'), null)
    await settle()

    expect(await service.list(USER)).toEqual([
      {
        id: name('20261004T100002Z'),
        createdAt: T0 + 2000,
        size: 3,
        url: `https://files.test/backups/${USER}/${name('20261004T100002Z')}`,
        isCurrent: true
      },
      {
        id: name('20261004T100001Z'),
        createdAt: T0 + 1000,
        size: 2,
        url: `https://files.test/backups/${USER}/${name('20261004T100001Z')}`,
        isCurrent: false
      }
    ])
  })

  it('deletes an older backup without touching the current one', async () => {
    const { service, state, settle } = setup()
    await service.upload(USER, bytes('[]'), null)
    await service.upload(USER, bytes('[]'), null)
    await settle()
    const current = state.backup

    expect(await service.remove(USER, name('20261004T100001Z'))).toEqual({ deleted: name('20261004T100001Z'), current })
    expect(state.backup).toEqual(current)
  })

  it('points the user at the newest remaining backup when the current one goes, and clears it at the end', async () => {
    const { service, state, settle } = setup()
    await service.upload(USER, bytes('[]'), null)
    await service.upload(USER, bytes('[]'), null)
    await settle()

    const repointed = await service.remove(USER, name('20261004T100002Z'))
    const cleared = await service.remove(USER, name('20261004T100001Z'))

    expect(repointed?.current).toEqual({
      url: `https://files.test/backups/${USER}/${name('20261004T100001Z')}`,
      updatedAt: T0 + 1000
    })
    expect(cleared).toEqual({ deleted: name('20261004T100001Z'), current: null })
    expect(state.backup).toBeNull()
    expect(await service.remove(USER, name('20261004T100001Z'))).toBeNull()
  })
})
