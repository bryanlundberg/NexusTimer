import type {
  CubeCategory,
  MySharedIds,
  SharedSolveItem,
  ShareSolveInput,
  SolveReplayPayload
} from '@nexustimer/contracts'
import { Types } from 'mongoose'
import { SharedSolveModel } from './shared-solves.model'

const LIST_PROJECTION = '-replay.moves -user -localSolveId'

export type StoredSharedSolve = { ownerId: string; item: SharedSolveItem; replay?: SolveReplayPayload }
export type InsertResult = 'created' | 'duplicate-slug' | 'duplicate-local-solve'

export type SharedSolvesRepository = {
  slugForLocalSolve(userId: string, localSolveId: string): Promise<string | null>
  insert(userId: string, slug: string, input: ShareSolveInput): Promise<InsertResult>
  deleteBySlug(userId: string, slug: string): Promise<boolean>
  findBySlug(slug: string): Promise<StoredSharedSolve | null>
  idsByLocalSolve(userId: string, limit: number): Promise<MySharedIds>
  pageForUser(
    userId: string,
    before: string | null,
    limit: number
  ): Promise<{ items: SharedSolveItem[]; lastId: string | null }>
  countForUser(userId: string): Promise<number>
}

type RawSharedSolve = {
  _id: Types.ObjectId
  slug: string
  user: Types.ObjectId
  puzzle: CubeCategory
  time: number
  plus2?: boolean
  dnf?: boolean
  scramble: string
  solvedAt: number
  replay?: SolveReplayPayload
  createdAt: Date
}

type DuplicateKeyError = { code?: number; keyPattern?: Record<string, unknown> }

function duplicateField(error: unknown) {
  const { code, keyPattern } = (error ?? {}) as DuplicateKeyError
  if (code !== 11000 || !keyPattern) return null
  if ('localSolveId' in keyPattern) return 'localSolveId'
  if ('slug' in keyPattern) return 'slug'
  return null
}

function toSharedSolveItem(doc: RawSharedSolve): SharedSolveItem {
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

export const sharedSolvesRepository: SharedSolvesRepository = {
  async slugForLocalSolve(userId, localSolveId) {
    const doc = await SharedSolveModel.findOne({ user: userId, localSolveId }, { slug: 1 }).lean<{ slug: string }>()
    return doc?.slug ?? null
  },

  async insert(userId, slug, input) {
    try {
      await SharedSolveModel.create({ ...input, slug, user: userId })
      return 'created'
    } catch (error) {
      const field = duplicateField(error)
      if (field === 'localSolveId') return 'duplicate-local-solve'
      if (field === 'slug') return 'duplicate-slug'
      throw error
    }
  },

  async deleteBySlug(userId, slug) {
    const deleted = await SharedSolveModel.findOneAndDelete({ slug, user: userId }, { projection: { _id: 1 } }).lean()
    return deleted !== null
  },

  async findBySlug(slug) {
    const doc = await SharedSolveModel.findOne({ slug }).lean<RawSharedSolve>()
    if (!doc) return null
    return {
      ownerId: doc.user.toString(),
      item: toSharedSolveItem(doc),
      ...(doc.replay ? { replay: doc.replay } : {})
    }
  },

  async idsByLocalSolve(userId, limit) {
    const docs = await SharedSolveModel.find({ user: userId }, { slug: 1, localSolveId: 1 })
      .sort({ _id: -1 })
      .limit(limit)
      .lean<{ slug: string; localSolveId: string }[]>()
    return Object.fromEntries(docs.map((doc) => [doc.localSolveId, doc.slug]))
  },

  async pageForUser(userId, before, limit) {
    const filter: Record<string, unknown> = { user: new Types.ObjectId(userId) }
    if (before) filter._id = { $lt: new Types.ObjectId(before) }

    const docs = await SharedSolveModel.find(filter)
      .select(LIST_PROJECTION)
      .sort({ _id: -1 })
      .limit(limit)
      .lean<RawSharedSolve[]>()
    const last = docs[docs.length - 1]
    return { items: docs.map(toSharedSolveItem), lastId: last ? last._id.toString() : null }
  },

  countForUser(userId) {
    return SharedSolveModel.countDocuments({ user: userId })
  }
}
