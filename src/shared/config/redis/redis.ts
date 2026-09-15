import { createClient, type RedisClientType } from 'redis'

// an unreachable Redis must fail fast instead of stalling the request.
const CONNECT_TIMEOUT_MS = 2000
const COMMAND_TIMEOUT_MS = 1500
const MAX_RECONNECT_DELAY_MS = 5000

type RedisGlobal = {
  client?: RedisClientType
  connectPromise?: Promise<RedisClientType>
  connectStartedAt?: number
}

const globalForRedis = globalThis as unknown as { __redis?: RedisGlobal }
const store: RedisGlobal = (globalForRedis.__redis ??= {})

function createRedisClient(): RedisClientType {
  const client: RedisClientType = createClient({
    url: process.env.REDIS_URL,
    disableOfflineQueue: true,
    commandOptions: { timeout: COMMAND_TIMEOUT_MS },
    socket: {
      connectTimeout: CONNECT_TIMEOUT_MS,
      reconnectStrategy: (retries) => Math.min(retries * 200, MAX_RECONNECT_DELAY_MS)
    }
  })
  client.on('error', (err) => console.error('Redis Client Error', err))
  return client
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  if (ms <= 0) return Promise.reject(new Error('Redis connection timed out'))

  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('Redis connection timed out')), ms)
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
}

export async function getRedis(): Promise<RedisClientType> {
  if (store.client?.isReady) return store.client

  if (!store.connectPromise) {
    const client = (store.client ??= createRedisClient())
    store.connectStartedAt = Date.now()
    store.connectPromise = client
      .connect()
      .then(() => client)
      .catch((err) => {
        store.connectPromise = undefined
        throw err
      })
    // Callers may have already given up waiting; keep a late failure from surfacing as unhandled
    store.connectPromise.catch(() => {})
  }

  // Callers only wait out what is left of the connect window, then fail immediately
  const elapsed = Date.now() - (store.connectStartedAt ?? 0)
  return withTimeout(store.connectPromise, CONNECT_TIMEOUT_MS - elapsed)
}

export default getRedis
