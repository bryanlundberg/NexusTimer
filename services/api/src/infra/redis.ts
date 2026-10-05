import { createClient, type RedisClientType } from 'redis'
import { logger, serializeError } from '../lib/logger'

const CONNECT_TIMEOUT_MS = 2000
const COMMAND_TIMEOUT_MS = 1500
const MAX_RECONNECT_DELAY_MS = 5000

type RedisState = {
  client?: RedisClientType
  connectPromise?: Promise<RedisClientType>
  connectStartedAt?: number
}

const state: RedisState = {}

function createRedisClient(url: string): RedisClientType {
  const client: RedisClientType = createClient({
    url,
    disableOfflineQueue: true,
    commandOptions: { timeout: COMMAND_TIMEOUT_MS },
    socket: {
      connectTimeout: CONNECT_TIMEOUT_MS,
      reconnectStrategy: (retries) => Math.min(retries * 200, MAX_RECONNECT_DELAY_MS)
    }
  })
  client.on('error', (error: unknown) => logger.error('redis client error', { error: serializeError(error) }))
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

export async function getRedis(url: string): Promise<RedisClientType> {
  if (state.client?.isReady) return state.client

  if (!state.connectPromise) {
    const client = (state.client ??= createRedisClient(url))
    state.connectStartedAt = Date.now()
    state.connectPromise = client
      .connect()
      .then(() => client)
      .catch((error: unknown) => {
        state.connectPromise = undefined
        throw error
      })
    state.connectPromise.catch(() => {})
  }

  const elapsed = Date.now() - (state.connectStartedAt ?? 0)
  return withTimeout(state.connectPromise, CONNECT_TIMEOUT_MS - elapsed)
}

export async function pingRedis(url: string) {
  const client = await getRedis(url)
  await client.ping()
}

export async function disconnectRedis() {
  const { client } = state
  state.client = undefined
  state.connectPromise = undefined
  if (client?.isOpen) await client.close()
}
