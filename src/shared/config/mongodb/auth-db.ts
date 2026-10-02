import { MongoClient } from 'mongodb'

const MAX_POOL_SIZE = 10

const globalForAuthDb = globalThis as unknown as { __authMongoClient?: MongoClient }

export const authMongoClient = (globalForAuthDb.__authMongoClient ??= new MongoClient(
  process.env.MONGODB_URI as string,
  { maxPoolSize: MAX_POOL_SIZE }
))

export const authDb = authMongoClient.db()
