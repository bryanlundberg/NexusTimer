import { createClient, type RedisClientType } from 'redis'

type RedisGlobal = {
  client?: RedisClientType
  connectPromise?: Promise<RedisClientType>
}

const globalForRedis = globalThis as unknown as { __redis?: RedisGlobal }
const store: RedisGlobal = (globalForRedis.__redis ??= {})

function createRedisClient(): RedisClientType {
  const client: RedisClientType = createClient({ url: process.env.REDIS_URL })
  client.on('error', (err) => console.error('Redis Client Error', err))
  return client
}

export async function getRedis(): Promise<RedisClientType> {
  if (store.client?.isReady) return store.client

  if (!store.connectPromise) {
    const client = (store.client ??= createRedisClient())
    store.connectPromise = client
      .connect()
      .then(() => client)
      .catch((err) => {
        store.connectPromise = undefined
        throw err
      })
  }

  return store.connectPromise
}

export default getRedis
