import User from '@/entities/user/model/user'
import { resolvePrivacy, type PrivacySettings } from '@/entities/privacy/model/types'

type PrivacyDoc = { _id: { toString(): string }; privacy?: Partial<PrivacySettings> }

export async function getPrivacyMap(ids: string[]): Promise<Map<string, PrivacySettings>> {
  const unique = [...new Set(ids)]
  const docs = unique.length ? await User.find({ _id: { $in: unique } }, { privacy: 1 }).lean<PrivacyDoc[]>() : []
  const stored = new Map(docs.map((doc) => [doc._id.toString(), doc.privacy]))
  return new Map(unique.map((id) => [id, resolvePrivacy(stored.get(id))]))
}

export async function getPrivacy(userId: string): Promise<PrivacySettings> {
  return (await getPrivacyMap([userId])).get(userId)!
}

export const sharesReadReceipts = (privacy: Map<string, PrivacySettings>, userId: string, otherId: string) =>
  !!privacy.get(userId)?.readReceipts && !!privacy.get(otherId)?.readReceipts

export async function readReceiptsShared(userId: string, otherId: string): Promise<boolean> {
  return sharesReadReceipts(await getPrivacyMap([userId, otherId]), userId, otherId)
}
