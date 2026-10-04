import type {
  CubingMethod,
  CurrentBackup,
  FriendUser,
  Layers,
  PrivacySettings,
  PublicProfile,
  PublicUser,
  UpdatePrivacyInput,
  UserStatsSummary
} from '@nexustimer/contracts'
import { Types } from 'mongoose'
import { userDocuments } from '../../infra/user-documents'
import { toPublicUser } from './public-user'
import { UserStatsModel } from './user-stats.model'
import { UserModel } from './users.model'

const PUBLIC_USER_FIELDS = 'name image country pronoun goal'
const FRIEND_CARD_FIELDS = 'name image country wcaId'
const FRIEND_PROFILE_FIELDS = `${FRIEND_CARD_FIELDS} pronoun method bio`
const PROFILE_PROJECTION = '-email -emailVerified -providers -privacy -__v'
const LIST_PROJECTION = '-email -emailVerified -providers -__v'
const NEWEST_BACKUP_FIRST = { 'backup.updatedAt': -1, createdAt: -1 } as const

export type ProfileUpdate = { $set?: Record<string, unknown>; $unset?: Record<string, ''> }
export type ListQuery = { name: string; country: string; excludeIds: string[]; page: number; perPage: number }
export type ListedUser = { profile: PublicProfile; privacy?: Partial<PrivacySettings> }
export type StatsSnapshot = { version: number; backupUpdatedAt: number; summary: UserStatsSummary }
export type AccountSummary = { id: string; email: string; name: string; createdAt: string; hasBackupFile: boolean }
export type UserContact = { name: string; email: string | null; privacy?: Partial<PrivacySettings> }

export type UsersRepository = {
  findPublicProfiles(ids: string[]): Promise<PublicUser[]>
  findProfile(id: string): Promise<PublicProfile | null>
  updateProfile(id: string, update: ProfileUpdate | null): Promise<PublicProfile | null>
  list(query: ListQuery): Promise<{ users: ListedUser[]; total: number }>
  privacy(ids: string[]): Promise<Map<string, Partial<PrivacySettings> | undefined>>
  backupUpdatedAt(id: string): Promise<number | undefined>
  statsSnapshot(id: string): Promise<StatsSnapshot | null>
  exists(id: string): Promise<boolean>
  findFriendUsers(ids: string[], withProfile: boolean): Promise<FriendUser[]>
  findContact(id: string): Promise<UserContact | null>
  updatePrivacy(id: string, input: UpdatePrivacyInput): Promise<void>
  findBackup(id: string): Promise<CurrentBackup | null>
  setBackup(id: string, backup: CurrentBackup | null): Promise<boolean>
  setImage(id: string, url: string): Promise<boolean>
  saveStats(id: string, stats: StatsSnapshot): Promise<'saved' | 'stale'>
  setWca(id: string, wca: { wcaId: string; verifiedAt: number } | null): Promise<'saved' | 'taken'>
  findAccountByEmail(email: string): Promise<AccountSummary | null>
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

function toFriendUser(doc: RawUser): FriendUser {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    image: doc.image,
    ...defined({
      country: doc.country,
      wcaId: doc.wcaId,
      pronoun: doc.pronoun,
      method: doc.method,
      bio: doc.bio
    })
  }
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
  },

  async exists(id) {
    if (!Types.ObjectId.isValid(id)) return false
    return !!(await UserModel.exists({ _id: id }))
  },

  async findFriendUsers(ids, withProfile) {
    const valid = [...new Set(ids)].filter((id) => Types.ObjectId.isValid(id))
    if (valid.length === 0) return []

    const docs = await UserModel.find({ _id: { $in: valid } })
      .select(withProfile ? FRIEND_PROFILE_FIELDS : FRIEND_CARD_FIELDS)
      .lean<RawUser[]>()
    return docs.map(toFriendUser)
  },

  async findContact(id) {
    if (!Types.ObjectId.isValid(id)) return null
    const doc = await UserModel.findById(id)
      .select('name email privacy')
      .lean<{ name: string; email?: string | null; privacy?: Partial<PrivacySettings> | null }>()
    return doc ? { name: doc.name, email: doc.email || null, privacy: doc.privacy ?? undefined } : null
  },

  async updatePrivacy(id, input) {
    const $set = Object.fromEntries(
      Object.entries(input)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [`privacy.${key}`, value])
    )
    if (Object.keys($set).length === 0) return
    await UserModel.updateOne({ _id: id }, { $set })
  },

  async findBackup(id) {
    const doc = await UserModel.findById(id).select('backup').lean<Pick<RawUser, 'backup'>>()
    const { url, updatedAt } = doc?.backup ?? {}
    return url && typeof updatedAt === 'number' ? { url, updatedAt } : null
  },

  async setBackup(id, backup) {
    const result = await UserModel.updateOne({ _id: id }, backup ? { $set: { backup } } : { $unset: { backup: 1 } })
    return result.matchedCount > 0
  },

  async setImage(id, url) {
    const result = await UserModel.updateOne({ _id: id }, { $set: { image: url } })
    return result.matchedCount > 0
  },

  async saveStats(id, stats) {
    // An older backup misses the filter and collides on the unique index, so it never replaces a newer summary.
    try {
      await UserStatsModel.updateOne(
        { user: id, backupUpdatedAt: { $lte: stats.backupUpdatedAt } },
        { $set: stats },
        { upsert: true }
      )
      return 'saved'
    } catch (error) {
      if ((error as { code?: number } | null)?.code === 11000) return 'stale'
      throw error
    }
  },

  async findAccountByEmail(email) {
    const doc = await UserModel.findOne({ email })
      .select('email name createdAt backup.url')
      .lean<{
        _id: Types.ObjectId
        email: string
        name: string
        createdAt: Date
        backup?: { url?: string | null } | null
      }>()
    if (!doc) return null
    return {
      id: doc._id.toString(),
      email: doc.email,
      name: doc.name,
      createdAt: new Date(doc.createdAt).toISOString(),
      hasBackupFile: Boolean(doc.backup?.url)
    }
  },

  async setWca(id, wca) {
    try {
      await UserModel.updateOne(
        { _id: id },
        wca ? { $set: { wcaId: wca.wcaId, wcaVerifiedAt: wca.verifiedAt } } : { $unset: { wcaId: 1, wcaVerifiedAt: 1 } }
      )
      return 'saved'
    } catch (error) {
      if ((error as { code?: number } | null)?.code === 11000) return 'taken'
      throw error
    }
  }
}

export const userStatsUserData = userDocuments(UserStatsModel, ({ id }) => ({ user: id }))
