import type { PublicUser } from '@nexustimer/contracts'
import { toPublicUser } from './public-user'
import { UserModel } from './users.model'

const PUBLIC_FIELDS = 'name image country pronoun goal'

export type UsersRepository = {
  findPublicProfiles(ids: string[]): Promise<PublicUser[]>
}

export const usersRepository: UsersRepository = {
  async findPublicProfiles(ids) {
    if (ids.length === 0) return []

    const docs = await UserModel.find({ _id: { $in: ids } })
      .select(PUBLIC_FIELDS)
      .lean()

    return docs.map((doc) => toPublicUser(String(doc._id), doc))
  }
}
