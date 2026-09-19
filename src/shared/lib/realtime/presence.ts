import { getRedis } from '@/shared/config/redis/redis'
import { presenceChannel, type PresenceStatus, type PresenceUser } from '@/shared/lib/realtime/events'

/** Mirrored from services/realtime/internal/broker/presence.go. */
const CONNS_PREFIX = 'rt:conns:'
const STATUS_PREFIX = 'rt:status:'
const LAST_SEEN_PREFIX = 'rt:lastseen:'
const GATEWAY_PREFIX = 'rt:gw:'

const CONN_MAX_AGE_SECONDS = 24 * 60 * 60

const LAST_SEEN_TTL_SECONDS = 30 * 24 * 60 * 60

export const statusKey = (userId: string) => STATUS_PREFIX + userId

interface ConnEntry {
  instanceId: string
  seconds: number
  idle: boolean
}

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

export async function readPresence(userIds: string[]): Promise<PresenceUser[]> {
  if (userIds.length === 0) return []

  try {
    const redis = await getRedis()
    const reads = redis.multi()
    for (const id of userIds) {
      reads.hGetAll(CONNS_PREFIX + id)
      reads.get(statusKey(id))
      reads.get(LAST_SEEN_PREFIX + id)
    }
    const replies = (await reads.exec()) as unknown[]

    const rows = userIds.map((userId, index) => ({
      userId,
      conns: (replies[index * 3] ?? {}) as Record<string, string>,
      status: (replies[index * 3 + 1] ?? null) as string | null,
      lastSeen: (replies[index * 3 + 2] ?? null) as string | null
    }))

    const liveGateways = await readLiveGateways(rows.flatMap((row) => gatewaysIn(row.conns)))
    return rows.map((row) => resolvePresence(row.userId, row.conns, row.status, row.lastSeen, liveGateways))
  } catch (error) {
    console.error('readPresence failed:', error)
    return userIds.map((userId) => ({ userId, state: 'offline' as const }))
  }
}

async function readLiveGateways(instanceIds: string[]): Promise<ReadonlySet<string>> {
  const unique = [...new Set(instanceIds)]
  if (unique.length === 0) return new Set()

  const redis = await getRedis()
  const checks = redis.multi()
  for (const id of unique) checks.exists(GATEWAY_PREFIX + id)
  const replies = (await checks.exec()) as unknown[]

  return new Set(unique.filter((_, index) => Number(replies[index]) === 1))
}

/** No TTL: an expiry would turn an invisible person visible. */
export async function writePresenceStatus(userId: string, status: PresenceStatus): Promise<void> {
  const redis = await getRedis()
  const write = redis.multi()
  write.get(statusKey(userId))
  write.set(statusKey(userId), status)
  const [previous] = (await write.exec()) as unknown[]

  // Stamped only on entering invisible; the gateway skips the disconnect stamp for invisible users.
  if (status === 'invisible' && previous !== 'invisible') {
    await redis.set(LAST_SEEN_PREFIX + userId, String(Date.now()), {
      expiration: { type: 'EX', value: LAST_SEEN_TTL_SECONDS }
    })
  }

  try {
    const [user] = await readPresence([userId])
    await redis.publish(presenceChannel(userId), JSON.stringify({ type: 'presence', users: [user] }))
  } catch (error) {
    console.error('writePresenceStatus publish failed:', error)
  }
}

export async function clearPresence(userId: string): Promise<void> {
  try {
    const redis = await getRedis()
    await redis.del([CONNS_PREFIX + userId, statusKey(userId), LAST_SEEN_PREFIX + userId])
  } catch (error) {
    console.error('clearPresence failed:', error)
  }
}
