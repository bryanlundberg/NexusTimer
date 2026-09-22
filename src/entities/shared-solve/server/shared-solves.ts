import { Types } from 'mongoose'
import SharedSolve, { type SharedSolveDocument } from '@/entities/shared-solve/model/shared-solve'
import { generateSlug } from '@/entities/shared-solve/lib/slug'
import {
  SHARED_SOLVES_PAGE_SIZE,
  type MySharedIds,
  type SharedSolveItem,
  type SharedSolvesPage,
  type ShareSolveInput
} from '@/entities/shared-solve/model/types'
import { blockStateOf } from '@/entities/block/server/blocks'

const SLUG_ATTEMPTS = 3
const MY_IDS_LIMIT = 5000
const LIST_PROJECTION = '-replay.moves -user -localSolveId'

type DuplicateKeyError = { code?: number; keyPattern?: Record<string, unknown> }

const isDuplicateKey = (error: unknown, field: string) => {
  const err = error as DuplicateKeyError
  return err?.code === 11000 && !!err.keyPattern && field in err.keyPattern
}

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
    sharedAt: doc.createdAt.toISOString()
  }
}

async function findExistingSlug(userId: string, localSolveId: string): Promise<string | null> {
  const existing = await SharedSolve.findOne({ user: userId, localSolveId }, { slug: 1 }).lean<{ slug: string }>()
  return existing?.slug ?? null
}

export async function createSharedSolve(
  userId: string,
  input: ShareSolveInput
): Promise<{ slug: string; created: boolean }> {
  const existing = await findExistingSlug(userId, input.localSolveId)
  if (existing) return { slug: existing, created: false }

  for (let attempt = 0; attempt < SLUG_ATTEMPTS; attempt++) {
    const slug = generateSlug()
    try {
      await SharedSolve.create({ ...input, slug, user: userId })
      return { slug, created: true }
    } catch (error) {
      if (isDuplicateKey(error, 'localSolveId')) {
        const raced = await findExistingSlug(userId, input.localSolveId)
        if (raced) return { slug: raced, created: false }
      }
      if (!isDuplicateKey(error, 'slug')) throw error
    }
  }

  throw new Error('Could not allocate a unique slug')
}

export async function listUserSharedSolves(userId: string, cursor?: string | null): Promise<SharedSolvesPage> {
  const filter: Record<string, unknown> = { user: new Types.ObjectId(userId) }
  if (cursor && Types.ObjectId.isValid(cursor)) filter._id = { $lt: new Types.ObjectId(cursor) }

  const [docs, total] = await Promise.all([
    SharedSolve.find(filter)
      .select(LIST_PROJECTION)
      .sort({ _id: -1 })
      .limit(SHARED_SOLVES_PAGE_SIZE)
      .lean<SharedSolveDocument[]>(),
    cursor ? Promise.resolve(-1) : SharedSolve.countDocuments({ user: userId })
  ])

  const last = docs[docs.length - 1]
  return {
    items: docs.map(toSharedSolveItem),
    total,
    nextCursor: docs.length === SHARED_SOLVES_PAGE_SIZE && last ? last._id.toString() : null
  }
}

export async function listMySharedIds(userId: string): Promise<MySharedIds> {
  const docs = await SharedSolve.find({ user: userId }, { slug: 1, localSolveId: 1 })
    .sort({ _id: -1 })
    .limit(MY_IDS_LIMIT)
    .lean<Pick<SharedSolveDocument, 'slug' | 'localSolveId'>[]>()
  return Object.fromEntries(docs.map((doc) => [doc.localSolveId, doc.slug]))
}

export async function isHiddenBetween(ownerId: string, viewerId: string | undefined): Promise<boolean> {
  if (!viewerId || viewerId === ownerId) return false
  return (await blockStateOf(viewerId, ownerId)) !== 'none'
}
