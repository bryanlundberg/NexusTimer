import type {
  CubingMethod,
  Layers,
  PrivacySettings,
  PublicProfile,
  PublicUser,
  UserStatsSummary
} from '@nexustimer/contracts'
import { Types } from 'mongoose'
import { toPublicUser } from './public-user'
import { UserStatsModel } from './user-stats.model'
import { UserModel } from './users.model'

const PUBLIC_USER_FIELDS = 'name image country pronoun goal'
const PROFILE_PROJECTION = '-email -emailVerified -providers -privacy -__v'
const LIST_PROJECTION = '-email -emailVerified -providers -__v'
const NEWEST_BACKUP_FIRST = { 'backup.updatedAt': -1, createdAt: -1 } as const

export type ProfileUpdate = { $set?: Record<string, unknown>; $unset?: Record<string, ''> }
export type ListQuery = { name: string; country: string; excludeIds: string[]; page: number; perPage: number }
export type ListedUser = { profile: PublicProfile; privacy?: Partial<PrivacySettings> }
export type StatsSnapshot = { version: number; backupUpdatedAt: number; summary: UserStatsSummary }

export type UsersRepository = {
  findPublicProfiles(ids: string[]): Promise<PublicUser[]>
  findProfile(id: string): Promise<PublicProfile | null>
  updateProfile(id: string, update: ProfileUpdate | null): Promise<PublicProfile | null>
  list(query: ListQuery): Promise<{ users: ListedUser[]; total: number }>
  privacy(ids: string[]): Promise<Map<string, Partial<PrivacySettings> | undefined>>
  backupUpdatedAt(id: string): Promise<number | undefined>
  statsSnapshot(id: string): Promise<StatsSnapshot | null>
}

type RawUser = {
  _id: Types.ObjectId
  name: string
  image: string
  bio?: string | null
  pronoun?: string | null
  country?: string | null
  goal?: string | null
  method?: CubingMethod | null
  mainColors?: Layers[] | null
  links?: string[] | null
  wcaId?: string | null
  wcaVerifiedAt?: number | null
  backup?: { url?: string | null; updatedAt?: number | null } | null
  privacy?: Partial<PrivacySettings> | null
  createdAt: Date
  updatedAt: Date
}

const defined = <T extends object>(fields: T) =>
  Object.fromEntries(Object.entries(fields).filter(([, value]) => value != null)) as {
    [K in keyof T]?: NonNullable<T[K]>
  }

export function toPublicProfile(doc: RawUser): PublicProfile {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    image: doc.image,
    ...defined({
      bio: doc.bio,
      pronoun: doc.pronoun,
      country: doc.country,
      goal: doc.goal,
      method: doc.method,
      mainColors: doc.mainColors,
      links: doc.links,
      wcaId: doc.wcaId,
      wcaVerifiedAt: doc.wcaVerifiedAt,
      backup: doc.backup ? defined({ url: doc.backup.url, updatedAt: doc.backup.updatedAt }) : null
    }),
    createdAt: new Date(doc.createdAt).toISOString(),
    updatedAt: new Date(doc.updatedAt).toISOString()
  }
}

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const usersRepository: UsersRepository = {
  async findPublicProfiles(ids) {
    const valid = ids.filter((id) => Types.ObjectId.isValid(id))
    if (valid.length === 0) return []

    const docs = await UserModel.find({ _id: { $in: valid } })
      .select(PUBLIC_USER_FIELDS)
      .lean()
    return docs.map((doc) => toPublicUser(String(doc._id), doc))
  },

  async findProfile(id) {
    if (!Types.ObjectId.isValid(id)) return null
    const doc = await UserModel.findById(id).select(PROFILE_PROJECTION).lean<RawUser>()
    return doc ? toPublicProfile(doc) : null
  },

  async updateProfile(id, update) {
    const doc = update
      ? await UserModel.findOneAndUpdate({ _id: id }, update, { returnDocument: 'after' })
          .select(PROFILE_PROJECTION)
          .lean<RawUser>()
      : await UserModel.findById(id).select(PROFILE_PROJECTION).lean<RawUser>()
    return doc ? toPublicProfile(doc) : null
  },

  async list({ name, country, excludeIds, page, perPage }) {
    const query: Record<string, unknown> = {}
    if (excludeIds.length) query._id = { $nin: excludeIds }
    if (name) {
      const regex = { $regex: escapeRegex(name), $options: 'i' }
      query.$or = [{ name: regex }, { wcaId: regex }]
    }
    if (country) query.country = country

    const [docs, total] = await Promise.all([
      UserModel.find(query)
        .select(LIST_PROJECTION)
        .sort(NEWEST_BACKUP_FIRST)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .lean<RawUser[]>(),
      UserModel.countDocuments(query)
    ])

    return {
      users: docs.map((doc) => ({ profile: toPublicProfile(doc), privacy: doc.privacy ?? undefined })),
      total
    }
  },

  async privacy(ids) {
    const unique = [...new Set(ids)].filter((id) => Types.ObjectId.isValid(id))
    const docs = unique.length
      ? await UserModel.find({ _id: { $in: unique } }, { privacy: 1 }).lean<Pick<RawUser, '_id' | 'privacy'>[]>()
      : []
    return new Map(docs.map((doc) => [doc._id.toString(), doc.privacy ?? undefined]))
  },

  async backupUpdatedAt(id) {
    if (!Types.ObjectId.isValid(id)) return undefined
    const doc = await UserModel.findById(id).select('backup.updatedAt').lean<Pick<RawUser, 'backup'>>()
    return doc?.backup?.updatedAt ?? undefined
  },

  async statsSnapshot(id) {
    if (!Types.ObjectId.isValid(id)) return null
    const doc = await UserStatsModel.findOne({ user: id })
      .select('version backupUpdatedAt summary')
      .lean<StatsSnapshot>()
    return doc ? { version: doc.version, backupUpdatedAt: doc.backupUpdatedAt, summary: doc.summary } : null
  }
}
