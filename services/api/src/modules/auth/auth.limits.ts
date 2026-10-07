import type { RedisClientType } from 'redis'
import { logger, serializeError } from '../../lib/logger'

const HOUR_SECONDS = 60 * 60
const TEN_MINUTES_SECONDS = 10 * 60

type Bucket = { key: string; limit: number; windowSeconds: number }

const bucket =
  (name: string, limit: number, windowSeconds: number) =>
  (subject: string): Bucket => ({ key: `rate-limit:auth:${name}:${subject}`, limit, windowSeconds })

const codeEmailsTo = bucket('code-emails', 3, HOUR_SECONDS)
const resetEmailsTo = bucket('reset-emails', 3, HOUR_SECONDS)
const emailsFromIp = bucket('emails-ip', 20, HOUR_SECONDS)
const codeChecksFromIp = bucket('code-checks-ip', 20, TEN_MINUTES_SECONDS)

export type AuthLimits = {
  sendCode(email: string, ip: string | null): Promise<boolean>
  sendReset(email: string, ip: string | null): Promise<boolean>
  checkCode(ip: string | null): Promise<boolean>
}

export function createAuthLimits(redis: () => Promise<RedisClientType>): AuthLimits {
  async function hit(client: RedisClientType, { key, limit, windowSeconds }: Bucket) {
    const [count] = await client.multi().incr(key).expire(key, windowSeconds, 'NX').exec()
    return Number(count) <= limit
  }

  async function consume(buckets: Bucket[]) {
    if (buckets.length === 0) return true
    try {
      const client = await redis()
      const results = await Promise.all(buckets.map((entry) => hit(client, entry)))
      return results.every(Boolean)
    } catch (error) {
      logger.warn('auth limit check failed, allowing it', { error: serializeError(error) })
      return true
    }
  }

  const fromIp = (ip: string | null, perIp: (ip: string) => Bucket) => (ip ? [perIp(ip)] : [])

  return {
    sendCode: (email, ip) => consume([codeEmailsTo(email), ...fromIp(ip, emailsFromIp)]),
    sendReset: (email, ip) => consume([resetEmailsTo(email), ...fromIp(ip, emailsFromIp)]),
    checkCode: (ip) => consume(fromIp(ip, codeChecksFromIp))
  }
}
