import { Types } from 'mongoose'
import SharedSolve, { type SharedSolveDocument } from '@/entities/shared-solve/model/shared-solve'
import { sharedSolveCache, type CachedSharedSolve } from '@/entities/shared-solve/model/shared-solve-cache'
import type { SharedSolveAuthor, SharedSolveItem } from '@/entities/shared-solve/model/types'
import { findFriendUsers } from '@/entities/friendship/server/friends'
import { userProfileCache } from '@/entities/user/model/user-cache'

export function toSharedSolveItem(doc: Omit<SharedSolveDocument, 'user' | 'localSolveId'>): SharedSolveItem {
  return {
    slug: doc.slug,
    puzzle: doc.puzzle,
    time: doc.time,
    plus2: !!doc.plus2,
    dnf: !!doc.dnf,
    scramble: doc.scramble,
    solvedAt: doc.solvedAt,
    hasReplay: !!doc.replay,
    sharedAt: new Date(doc.createdAt).toISOString()
  }
}

export async function dropUserSharedSolvesCache(userId: Types.ObjectId | string): Promise<void> {
  const docs = await SharedSolve.find({ user: userId }, { slug: 1 }).lean<{ slug: string }[]>()
  await sharedSolveCache.invalidate(
    userId.toString(),
    docs.map((doc) => doc.slug)
  )
}

export async function getSharedSolveBySlug(slug: string): Promise<CachedSharedSolve | null> {
  const cached = await sharedSolveCache.getBySlug(slug)
  if (cached === 'missing') return null
  if (cached) return cached

  const doc = await SharedSolve.findOne({ slug }).lean<SharedSolveDocument>()
  const value = doc ? { ownerId: doc.user.toString(), item: toSharedSolveItem(doc), replay: doc.replay } : null
  await sharedSolveCache.primeSlug(slug, value)
  return value
}

export async function getSharedSolveAuthor(ownerId: string): Promise<SharedSolveAuthor | null> {
  const profile = await userProfileCache.get(ownerId)
  const user = profile ?? (await findFriendUsers([ownerId])).get(ownerId)
  if (!user) return null
  return { _id: ownerId, name: user.name, image: user.image, country: user.country }
}
