import type { AchievementRarityInput } from '@nexustimer/contracts'
import { describe, expect, it, vi } from 'vitest'
import type { SearchAdmin, SearchTask } from '../src/infra/search'
import type { UserDocuments } from '../src/infra/user-documents'
import { type AdminService, createAdminService } from '../src/modules/admin/admin.service'
import type { ProductsRepository } from '../src/modules/products/products.repository'
import { createProductsService, type ProductsService } from '../src/modules/products/products.service'
import { buildTestApp, testEnv } from './helpers'

const TOKEN = 'admin-token-0123456789'
const USER = '64b7f0c2a1b2c3d4e5f60718'
const account = {
  id: USER,
  email: 'ana@test.dev',
  name: 'Ana',
  createdAt: '2026-01-01T00:00:00.000Z',
  hasBackupFile: true
}

function adminSetup({ found = true, failFiles = false } = {}) {
  const calls: string[] = []
  const counts: Record<string, number> = { solves: 3, sharedSolves: 1, feedback: 2 }
  const userData = Object.fromEntries(
    Object.entries(counts).map(([key, total]) => [
      key,
      {
        count: async () => total,
        purge: async () => {
          calls.push(`purge:${key}`)
          return total
        }
      } satisfies UserDocuments
    ])
  )

  const service = createAdminService({
    users: {
      findByEmail: async (email) => (found && email === account.email ? account : null),
      forgetProfile: async (id) => {
        calls.push(`forgetProfile:${id}`)
      },
      forgetCaches: async (id) => {
        calls.push(`forgetCaches:${id}`)
      }
    },
    achievements: {
      list: async () => [{ key: 'contributor', createdAt: '2026-02-02T00:00:00.000Z' }],
      grant: async (_, key) => ({ key, createdAt: '2026-03-03T00:00:00.000Z' }),
      revoke: async () => 1,
      saveRarity: async () => {
        calls.push('saveRarity')
      }
    },
    userData,
    accounts: {
      authRecords: async () => {
        calls.push('authRecords')
        return { accounts: 2, authSessions: 1 }
      },
      deleteUser: async (id) => {
        calls.push(`deleteUser:${id}`)
      }
    },
    storage: {
      list: async (prefix) => {
        if (failFiles) throw new Error('B2 down')
        return [{ key: `${prefix}a.json`, size: 1 }]
      },
      delete: async (keys) => {
        if (failFiles) throw new Error('B2 down')
        calls.push(`delete:${[keys].flat().join(',')}`)
      }
    },
    presence: {
      clear: async (id) => {
        calls.push(`presence:${id}`)
      }
    },
    sharedSolves: {
      forgetUser: async (id) => {
        calls.push(`sharedCache:${id}`)
      }
    }
  })

  return { service, calls }
}

describe('admin service', () => {
  it('lists, grants and revokes achievements by email and drops the cached profile', async () => {
    const { service, calls } = adminSetup()

    expect(await service.achievements('ana@test.dev')).toEqual({
      user: { _id: USER, email: 'ana@test.dev', name: 'Ana' },
      achievements: [{ key: 'contributor', createdAt: '2026-02-02T00:00:00.000Z' }]
    })
    expect(await service.grant('ana@test.dev', 'bug-hunter')).toEqual({
      granted: { key: 'bug-hunter', createdAt: '2026-03-03T00:00:00.000Z' },
      user: { _id: USER, email: 'ana@test.dev' }
    })
    expect(await service.revoke('ana@test.dev', 'bug-hunter')).toEqual({
      removed: { key: 'bug-hunter', deletedCount: 1 },
      user: { _id: USER, email: 'ana@test.dev' }
    })
    expect(calls).toEqual([`forgetProfile:${USER}`, `forgetProfile:${USER}`])
    expect(await service.grant('nobody@test.dev', 'bug-hunter')).toBeNull()
  })

  it('summarizes what a user owns, auth records included', async () => {
    const { service } = adminSetup()

    expect(await service.userSummary('ana@test.dev')).toEqual({
      user: {
        _id: USER,
        email: 'ana@test.dev',
        name: 'Ana',
        createdAt: '2026-01-01T00:00:00.000Z',
        hasBackupFile: true
      },
      counts: { solves: 3, sharedSolves: 1, feedback: 2, accounts: 2, authSessions: 1 }
    })
  })

  it('deletes files, presence and caches before the data, then the account', async () => {
    const { service, calls } = adminSetup()

    const result = await service.deleteUser('ana@test.dev')

    expect(result).toEqual({
      deleted: {
        user: { _id: USER, email: 'ana@test.dev' },
        solves: 3,
        sharedSolves: 1,
        feedback: 2,
        accounts: 2,
        authSessions: 1
      }
    })
    expect(calls).toEqual([
      `delete:backups/${USER}/a.json`,
      `delete:avatars/${USER}`,
      `presence:${USER}`,
      `sharedCache:${USER}`,
      'purge:solves',
      'purge:sharedSolves',
      'purge:feedback',
      'authRecords',
      `deleteUser:${USER}`,
      `forgetCaches:${USER}`
    ])
  })

  it('still deletes the user when the files cannot be removed', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { service, calls } = adminSetup({ failFiles: true })

    await service.deleteUser('ana@test.dev')

    expect(calls).toContain(`deleteUser:${USER}`)
  })

  it('stores rarity and reports what it saved', async () => {
    const { service, calls } = adminSetup()
    const stats: AchievementRarityInput = {
      registeredUsers: 10,
      scannedUsers: 9,
      failedUsers: 1,
      computedAt: new Date('2026-10-04T00:00:00.000Z'),
      badges: { contributor: { holders: 2, pct: 22.22 }, 'bug-hunter': { holders: 1, pct: 11.11 } }
    }

    expect(await service.saveRarity(stats)).toEqual({ badges: 2, computedAt: stats.computedAt })
    expect(calls).toEqual(['saveRarity'])
  })
})

describe('products service', () => {
  function productsSetup(task: SearchTask = { status: 'succeeded', taskUid: 7 }) {
    const published: string[][] = []
    const added: unknown[] = []
    const repository: ProductsRepository = {
      discover: async () => 2,
      pending: async () => [{ id: 'gan-12', url: 'https://shop.test/gan-12' }],
      recordScrapes: async (results) => results.length,
      scraped: async () => [
        { id: 'gan-12', url: 'u', category: '3x3', name: 'GAN 12', brand: ['GAN'], image: null, specs: {} }
      ],
      markPublished: async (ids) => {
        published.push(ids)
      }
    }
    const search: SearchAdmin = {
      addDocuments: async (_, documents) => {
        added.push(documents)
        return task
      },
      deleteIndex: async () => task,
      stats: async () => ({ numberOfDocuments: 1 })
    }
    return { service: createProductsService({ repository, search }), published, added }
  }

  it('publishes scraped products and marks them only after the index task succeeds', async () => {
    const ok = productsSetup()
    const failed = productsSetup({ status: 'failed', taskUid: 8 })

    expect(await ok.service.publish()).toEqual({ published: 1 })
    expect(ok.published).toEqual([['gan-12']])
    expect(await failed.service.publish()).toEqual({ failed: { status: 'failed', taskUid: 8 } })
    expect(failed.published).toEqual([])
  })

  it('counts scrape results and discoveries', async () => {
    const { service } = productsSetup()

    expect(
      await service.recordScrapes([
        { id: 'a', error: 'timeout' },
        { id: 'b', name: 'B', brand: [], image: null, specs: {} }
      ])
    ).toEqual({ scraped: 1, failed: 1, matched: 2 })
    expect(
      await service.discover([{ id: 'a', url: 'https://shop.test/a', collectionSlug: 'cubes', category: '3x3' }])
    ).toEqual({ received: 1, inserted: 2 })
  })
})

describe('admin routes', () => {
  const unused = () => Promise.reject(new Error('not used'))

  function appWith(
    admin: Partial<AdminService> = {},
    products: Partial<ProductsService> = {},
    token: string | null = TOKEN
  ) {
    return buildTestApp({
      env: testEnv({ ADMIN_TOKEN: token ?? undefined }),
      admin: {
        achievements: unused,
        grant: unused,
        revoke: unused,
        saveRarity: unused,
        userSummary: unused,
        deleteUser: unused,
        ...admin
      },
      products: {
        index: unused,
        deleteIndex: unused,
        stats: unused,
        discover: unused,
        pending: unused,
        recordScrapes: unused,
        publish: unused,
        ...products
      }
    })
  }

  const asAdmin = (init: RequestInit = {}) => ({ ...init, headers: { 'x-admin-token': TOKEN, ...init.headers } })
  const json = (method: string, body: unknown) =>
    asAdmin({ method, headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })

  it('answers 401 without the right token, or when no token is configured', async () => {
    const stats = vi.fn(async () => ({}))

    const missing = await appWith({}, { stats }).request('/api/v1/admin/ingestion/products')
    const wrong = await appWith({}, { stats }).request('/api/v1/admin/ingestion/products', {
      headers: { 'x-admin-token': 'nope' }
    })
    const unconfigured = await appWith({}, { stats }, null).request('/api/v1/admin/ingestion/products', asAdmin())
    const allowed = await appWith({}, { stats }).request('/api/v1/admin/ingestion/products', asAdmin())

    expect([missing.status, wrong.status, unconfigured.status]).toEqual([401, 401, 401])
    expect(await missing.json()).toEqual({ message: 'Unauthorized' })
    expect(await allowed.json()).toEqual({ stats: {} })
    expect(stats).toHaveBeenCalledOnce()
  })

  it('normalizes emails and needs them for user and achievement lookups', async () => {
    const userSummary = vi.fn<AdminService['userSummary']>(async () => null)
    const app = appWith({ userSummary })

    const missing = await app.request('/api/v1/admin/users', asAdmin())
    const notFound = await app.request('/api/v1/admin/users?email=%20Ana@Test.DEV%20', asAdmin())

    expect(missing.status).toBe(400)
    expect(await missing.json()).toEqual({ message: 'email query param is required' })
    expect(notFound.status).toBe(404)
    expect(userSummary).toHaveBeenCalledWith('ana@test.dev')
  })

  it('only grants manual achievements', async () => {
    const grant = vi.fn<AdminService['grant']>(async (email, key) => ({
      granted: { key, createdAt: '2026-01-01T00:00:00.000Z' },
      user: { _id: USER, email }
    }))
    const app = appWith({ grant })

    const invalid = await app.request(
      '/api/v1/admin/achievements',
      json('POST', { email: 'ana@test.dev', key: 'sub-10' })
    )
    const granted = await app.request(
      '/api/v1/admin/achievements',
      json('POST', { email: 'ANA@test.dev', key: 'contributor' })
    )

    expect(invalid.status).toBe(400)
    expect(await invalid.json()).toEqual({
      message: 'Invalid key. Allowed: public-sponsor, contributor, bug-hunter, playstore-beta'
    })
    expect(granted.status).toBe(200)
    expect(grant).toHaveBeenCalledWith('ana@test.dev', 'contributor')
  })

  it('needs both email and key to revoke', async () => {
    const res = await appWith().request('/api/v1/admin/achievements?email=ana@test.dev', asAdmin({ method: 'DELETE' }))

    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ message: 'email and key query params are required' })
  })

  it('validates and saves a rarity run', async () => {
    const saveRarity = vi.fn<AdminService['saveRarity']>(async (stats) => ({ badges: 1, computedAt: stats.computedAt }))
    const app = appWith({ saveRarity })
    const run = {
      registeredUsers: 4,
      scannedUsers: 4,
      failedUsers: 0,
      computedAt: '2026-10-04T00:00:00.000Z',
      badges: { contributor: { holders: 1, pct: 25 } }
    }

    const invalid = await app.request(
      '/api/v1/admin/rarity',
      json('POST', { ...run, badges: { x: { holders: 1, pct: 101 } } })
    )
    const saved = await app.request('/api/v1/admin/rarity', json('POST', run))

    expect(invalid.status).toBe(400)
    expect(await saved.json()).toEqual({ badges: 1, computedAt: '2026-10-04T00:00:00.000Z' })
    expect(saveRarity.mock.calls[0]![0].computedAt).toBeInstanceOf(Date)
  })

  it('keeps the ingestion guard rails and failure bodies', async () => {
    const failedTask = { status: 'failed', taskUid: 3 }
    const app = appWith(
      {},
      {
        index: async () => ({ ok: false, task: failedTask }),
        deleteIndex: async () => ({ ok: true, task: { status: 'succeeded', taskUid: 4 } }),
        publish: async () => ({ failed: failedTask }),
        pending: async () => [{ id: 'a', url: 'https://shop.test/a' }]
      }
    )
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const empty = await app.request('/api/v1/admin/ingestion/products', json('POST', { documents: [] }))
    const failed = await app.request('/api/v1/admin/ingestion/products', json('POST', [{ id: 'a', name: 'A' }]))
    const unconfirmed = await app.request('/api/v1/admin/ingestion/products', asAdmin({ method: 'DELETE' }))
    const deleted = await app.request('/api/v1/admin/ingestion/products?index=products', asAdmin({ method: 'DELETE' }))
    const publish = await app.request('/api/v1/admin/ingestion/products/publish', asAdmin({ method: 'POST' }))
    const badQuery = await app.request('/api/v1/admin/ingestion/products/pending?category=nope', asAdmin())
    const pending = await app.request('/api/v1/admin/ingestion/products/pending?category=3x3', asAdmin())

    expect(empty.status).toBe(400)
    expect(await empty.json()).toEqual({ message: 'No documents to index' })
    expect(failed.status).toBe(500)
    expect(await failed.json()).toEqual({ message: 'Ingestion task failed', task: failedTask })
    expect(await unconfirmed.json()).toEqual({ message: 'Pass ?index=products to confirm deleting the index' })
    expect(await deleted.json()).toEqual({ deletedIndex: 'products', task: { status: 'succeeded', taskUid: 4 } })
    expect(publish.status).toBe(500)
    expect(badQuery.status).toBe(400)
    expect(await pending.json()).toEqual({ products: [{ id: 'a', url: 'https://shop.test/a' }] })
  })
})
