import type { PresenceStatus, PresenceUser } from '@nexustimer/contracts'
import type { RedisClientType } from 'redis'
import type { RealtimePublisher } from '../../infra/realtime'
import { logger, serializeError } from '../../lib/logger'

/** Mirrored from services/realtime/internal/broker/presence.go. */
const CONNS_PREFIX = 'rt:conns:'
const STATUS_PREFIX = 'rt:status:'
const LAST_SEEN_PREFIX = 'rt:lastseen:'
const GATEWAY_PREFIX = 'rt:gw:'

const CONN_MAX_AGE_SECONDS = 24 * 60 * 60
const LAST_SEEN_TTL_SECONDS = 30 * 24 * 60 * 60

export type PresenceStore = {
  setStatus(userId: string, status: PresenceStatus): Promise<void>
  clear(userId: string): Promise<void>
}

type ConnEntry = { instanceId: string; seconds: number; idle: boolean }

function parseConnValue(value: string): ConnEntry | null {
  const [instanceId, stamp, flag] = value.split(':')
  if (!instanceId || flag === undefined) return null

  const seconds = Number(stamp)
  if (!Number.isFinite(seconds)) return null

  return { instanceId, seconds, idle: flag === '1' }
}

function isLive(entry: ConnEntry, liveGateways: ReadonlySet<string>): boolean {
  if (!liveGateways.has(entry.instanceId)) return false
  return Math.floor(Date.now() / 1000) - entry.seconds < CONN_MAX_AGE_SECONDS
}

export function gatewaysIn(conns: Record<string, string>): string[] {
  const ids = new Set<string>()
  for (const value of Object.values(conns)) {
    const entry = parseConnValue(value)
    if (entry) ids.add(entry.instanceId)
  }
  return [...ids]
}

export function resolvePresence(
  userId: string,
  conns: Record<string, string>,
  status: string | null,
  lastSeen: string | null,
  liveGateways: ReadonlySet<string>
): PresenceUser {
  let reachable = false
  let allIdle = true
  for (const value of Object.values(conns)) {
    const entry = parseConnValue(value)
    if (!entry || !isLive(entry, liveGateways)) continue
    reachable = true
    if (!entry.idle) allIdle = false
  }

  if (status === 'invisible' || !reachable) {
    const stamp = Number(lastSeen)
    return Number.isFinite(stamp) && stamp > 0
      ? { userId, state: 'offline', lastSeen: stamp }
      : { userId, state: 'offline' }
  }

  if (status === 'busy') return { userId, state: 'busy' }
  if (status === 'away' || allIdle) return { userId, state: 'away' }
  return { userId, state: 'online' }
}

export function createPresenceStore(
  redis: () => Promise<RedisClientType>,
  publisher: Pick<RealtimePublisher, 'presence'>
): PresenceStore {
  async function liveGateways(client: RedisClientType, instanceIds: string[]): Promise<ReadonlySet<string>> {
    const unique = [...new Set(instanceIds)]
    if (unique.length === 0) return new Set()

    const checks = client.multi()
    for (const id of unique) checks.exists(GATEWAY_PREFIX + id)
    const replies = await checks.exec()

    return new Set(unique.filter((_, index) => Number(replies[index]) === 1))
  }

  async function read(userId: string): Promise<PresenceUser> {
    try {
      const client = await redis()
      const [conns, status, lastSeen] = (await client
        .multi()
        .hGetAll(CONNS_PREFIX + userId)
        .get(STATUS_PREFIX + userId)
        .get(LAST_SEEN_PREFIX + userId)
        .exec()) as unknown as [Record<string, string> | null, string | null, string | null]

      const live = await liveGateways(client, gatewaysIn(conns ?? {}))
      return resolvePresence(userId, conns ?? {}, status, lastSeen, live)
    } catch (error) {
      logger.warn('presence read failed', { error: serializeError(error) })
      return { userId, state: 'offline' }
    }
  }

  return {
    /** No TTL on the status: an expiry would turn an invisible person visible. */
    async setStatus(userId, status) {
      const client = await redis()
      const [previous] = (await client
        .multi()
        .get(STATUS_PREFIX + userId)
        .set(STATUS_PREFIX + userId, status)
        .exec()) as unknown as [string | null, unknown]

      // Stamped only on entering invisible; the gateway skips the disconnect stamp for invisible users.
      if (status === 'invisible' && previous !== 'invisible') {
        await client.set(LAST_SEEN_PREFIX + userId, String(Date.now()), { EX: LAST_SEEN_TTL_SECONDS })
      }

      await publisher.presence(await read(userId))
    },

    async clear(userId) {
      try {
        await (await redis()).del([CONNS_PREFIX + userId, STATUS_PREFIX + userId, LAST_SEEN_PREFIX + userId])
      } catch (error) {
        logger.warn('presence clear failed', { error: serializeError(error) })
      }
    }
  }
}
