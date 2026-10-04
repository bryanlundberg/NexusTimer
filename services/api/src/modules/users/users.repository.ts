import type { PublicUser } from '@nexustimer/contracts'
import { UserModel } from './users.model'

const PUBLIC_FIELDS = 'name image country pronoun goal'

export type UsersRepository = {
  findPublicProfiles(ids: string[]): Promise<PublicUser[]>
}

const present = <K extends string>(key: K, value: string | null | undefined) =>
  value == null ? {} : ({ [key]: value } as Record<K, string>)

export const usersRepository: UsersRepository = {
  async findPublicProfiles(ids) {
    if (ids.length === 0) return []

    const docs = await UserModel.find({ _id: { $in: ids } })
      .select(PUBLIC_FIELDS)
      .lean()

    return docs.map((doc) => ({
      _id: String(doc._id),
      name: doc.name,
      image: doc.image,
      ...present('country', doc.country),
      ...present('pronoun', doc.pronoun),
      ...present('goal', doc.goal)
    }))
  }
}
