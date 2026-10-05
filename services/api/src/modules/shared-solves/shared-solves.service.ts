import {
  isObjectId,
  type MySharedIds,
  SHARED_SOLVES_PAGE_SIZE,
  type SharedSolveDetail,
  type SharedSolvesPage,
  type ShareSolveInput
} from '@nexustimer/contracts'
import type { SocialService } from '../social/social.service'
import type { UsersService } from '../users/users.service'
import type { SharedSolvesCache } from './shared-solves.cache'
import type { ShareQuota } from './shared-solves.quota'
import type { SharedSolvesRepository, StoredSharedSolve } from './shared-solves.repository'
import { generateSlug as randomSlug } from './slug'

const SLUG_ATTEMPTS = 3
const MY_IDS_LIMIT = 5000

export type ShareResult = { status: 'existing' | 'created'; slug: string } | { status: 'rate-limited' }

export type SharedSolvesService = {
  myIds(userId: string): Promise<MySharedIds>
  share(userId: string, input: ShareSolveInput): Promise<ShareResult>
  detail(slug: string, viewerId: string | null): Promise<SharedSolveDetail | null>
  remove(userId: string, slug: string): Promise<boolean>
  userPage(userId: string, viewerId: string | null, cursor: string | null): Promise<SharedSolvesPage>
  forgetUser(userId: string): Promise<void>
}

export const EMPTY_SHARED_SOLVES_PAGE: SharedSolvesPage = { items: [], total: 0, nextCursor: null }

type SharedSolvesDeps = {
  repository: SharedSolvesRepository
  cache: SharedSolvesCache
  quota: ShareQuota
  users: Pick<UsersService, 'publicProfiles'>
  social: Pick<SocialService, 'blockState'>
  generateSlug?: () => string
}

export function createSharedSolvesService({
  repository,
  cache,
  quota,
  users,
  social,
  generateSlug = randomSlug
}: SharedSolvesDeps): SharedSolvesService {
  async function myIds(userId: string) {
    const cached = await cache.getIds(userId)
    if (cached) return cached

    const ids = await repository.idsByLocalSolve(userId, MY_IDS_LIMIT)
    await cache.primeIds(userId, ids)
    return ids
  }

  async function bySlug(slug: string): Promise<StoredSharedSolve | null> {
    const cached = await cache.getBySlug(slug)
    if (cached === 'missing') return null
    if (cached) return cached

    const stored = await repository.findBySlug(slug)
    await cache.primeSlug(slug, stored)
    return stored
  }

  async function isHidden(ownerId: string, viewerId: string | null) {
    if (!viewerId || viewerId === ownerId) return false
    return (await social.blockState(viewerId, ownerId)) !== 'none'
  }

  async function create(userId: string, input: ShareSolveInput): Promise<ShareResult> {
    const prior = await repository.slugForLocalSolve(userId, input.localSolveId)
    if (prior) return { status: 'existing', slug: prior }

    for (let attempt = 0; attempt < SLUG_ATTEMPTS; attempt++) {
      const slug = generateSlug()
      const result = await repository.insert(userId, slug, input)

      if (result === 'created') {
        await cache.invalidate(userId, [slug])
        return { status: 'created', slug }
      }
      if (result === 'duplicate-local-solve') {
        const raced = await repository.slugForLocalSolve(userId, input.localSolveId)
        if (raced) return { status: 'existing', slug: raced }
        throw new Error('Shared solve conflicted on its local id but no slug was found')
      }
    }

    throw new Error('Could not allocate a unique slug')
  }

  return {
    myIds,

    async share(userId, input) {
      const existing = (await myIds(userId))[input.localSolveId]
      if (existing) return { status: 'existing', slug: existing }
      if (!(await quota.consume(userId))) return { status: 'rate-limited' }
      return create(userId, input)
    },

    async detail(slug, viewerId) {
      const solve = await bySlug(slug)
      if (!solve) return null

      const [hidden, profiles] = await Promise.all([
        isHidden(solve.ownerId, viewerId),
        users.publicProfiles([solve.ownerId])
      ])
      const owner = profiles.get(solve.ownerId)
      if (hidden || !owner) return null

      return {
        ...solve.item,
        author: {
          _id: solve.ownerId,
          name: owner.name,
          image: owner.image,
          ...(owner.country ? { country: owner.country } : {})
        },
        ...(solve.replay ? { replay: solve.replay } : {}),
        isOwner: viewerId === solve.ownerId
      }
    },

    async forgetUser(userId) {
      await cache.invalidate(userId, await repository.slugsForUser(userId))
    },

    async remove(userId, slug) {
      if (!(await repository.deleteBySlug(userId, slug))) return false
      await cache.invalidate(userId, [slug])
      return true
    },

    async userPage(userId, viewerId, cursor) {
      if (await isHidden(userId, viewerId)) return EMPTY_SHARED_SOLVES_PAGE

      const isFirstPage = !isObjectId(cursor)
      if (isFirstPage) {
        const cached = await cache.getFirstPage(userId)
        if (cached) return cached
      }

      const [{ items, lastId }, total] = await Promise.all([
        repository.pageForUser(userId, isFirstPage ? null : cursor, SHARED_SOLVES_PAGE_SIZE),
        isFirstPage ? repository.countForUser(userId) : Promise.resolve(-1)
      ])
      const page = { items, total, nextCursor: items.length === SHARED_SOLVES_PAGE_SIZE ? lastId : null }

      if (isFirstPage) await cache.primeFirstPage(userId, page)
      return page
    }
  }
}
