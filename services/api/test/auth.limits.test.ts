import { describe, expect, it, vi } from 'vitest'
import { createAuthLimits } from '../src/modules/auth/auth.limits'
import { fakeRedis } from './fake-redis'

async function repeat(times: number, run: () => Promise<boolean>) {
  const results = []
  for (let i = 0; i < times; i++) results.push(await run())
  return results
}

describe('auth limits', () => {
  it('sends at most three codes an hour to the same email', async () => {
    const redis = fakeRedis()
    const limits = createAuthLimits(redis.provider)

    const results = await repeat(4, () => limits.sendCode('mateo@example.com', '203.0.113.7'))

    expect(results).toEqual([true, true, true, false])
    expect(await limits.sendCode('other@example.com', '203.0.113.7')).toBe(true)
    expect(redis.ttls.get('rate-limit:auth:code-emails:mateo@example.com')).toBe(3600)
  })

  it('counts reset emails apart from codes', async () => {
    const limits = createAuthLimits(fakeRedis().provider)

    await repeat(3, () => limits.sendCode('mateo@example.com', null))

    expect(await repeat(4, () => limits.sendReset('mateo@example.com', null))).toEqual([true, true, true, false])
  })

  it('shares one hourly email budget of twenty per ip', async () => {
    const redis = fakeRedis()
    const limits = createAuthLimits(redis.provider)
    let n = 0

    const codes = await repeat(15, () => limits.sendCode(`user${n++}@example.com`, '203.0.113.7'))
    const resets = await repeat(6, () => limits.sendReset(`user${n++}@example.com`, '203.0.113.7'))

    expect([...codes, ...resets].filter(Boolean)).toHaveLength(20)
    expect(resets.at(-1)).toBe(false)
    expect(await limits.sendCode('fresh@example.com', '198.51.100.1')).toBe(true)
  })

  it('allows twenty code checks per ip every ten minutes', async () => {
    const redis = fakeRedis()
    const limits = createAuthLimits(redis.provider)

    const results = await repeat(21, () => limits.checkCode('203.0.113.7'))

    expect(results.filter(Boolean)).toHaveLength(20)
    expect(results.at(-1)).toBe(false)
    expect(redis.ttls.get('rate-limit:auth:code-checks-ip:203.0.113.7')).toBe(600)
  })

  it('skips the ip limit when the client ip is unknown', async () => {
    const redis = fakeRedis()
    const limits = createAuthLimits(redis.provider)

    expect(await repeat(30, () => limits.checkCode(null))).not.toContain(false)
    expect(redis.strings.size).toBe(0)
  })

  it('fails open when Redis is down', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    const redis = fakeRedis()
    redis.state.down = true
    const limits = createAuthLimits(redis.provider)

    expect(await limits.sendCode('mateo@example.com', '203.0.113.7')).toBe(true)
    expect(await limits.sendReset('mateo@example.com', '203.0.113.7')).toBe(true)
    expect(await limits.checkCode('203.0.113.7')).toBe(true)
  })
})
