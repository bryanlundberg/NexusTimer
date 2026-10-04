import mongoose from 'mongoose'

const MAX_POOL_SIZE = 10
const SERVER_SELECTION_TIMEOUT_MS = 5000

let pending: Promise<typeof mongoose> | undefined

export function connectMongo(uri: string) {
  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose)

  pending ??= mongoose
    .connect(uri, { maxPoolSize: MAX_POOL_SIZE, serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS })
    .catch((error: unknown) => {
      pending = undefined
      throw error
    })
  return pending
}

export async function pingMongo(uri: string) {
  const { connection } = await connectMongo(uri)
  if (!connection.db) throw new Error('MongoDB connection has no database handle')
  await connection.db.admin().ping()
}

export async function disconnectMongo() {
  pending = undefined
  await mongoose.disconnect()
}
