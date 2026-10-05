import mongoose, { type Model, Types } from 'mongoose'

export type UserRef = { id: string; email: string }

export type UserDocuments = {
  count(user: UserRef): Promise<number>
  purge(user: UserRef): Promise<number>
}

type Filter = (user: UserRef) => Record<string, unknown>

export function userDocuments<T>(model: Model<T>, filter: Filter): UserDocuments {
  return {
    count: (user) => model.countDocuments(filter(user)),
    purge: async (user) => (await model.deleteMany(filter(user))).deletedCount
  }
}

export function userCollection(name: string, field: string): UserDocuments {
  const filter = (user: UserRef) => ({ [field]: new Types.ObjectId(user.id) })
  return {
    count: (user) => mongoose.connection.collection(name).countDocuments(filter(user)),
    purge: async (user) => (await mongoose.connection.collection(name).deleteMany(filter(user))).deletedCount
  }
}
