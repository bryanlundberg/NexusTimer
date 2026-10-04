import { describe, expect, it } from 'vitest'
import { parseEnv } from '../src/config/env'

const base = {
  MONGODB_URI: 'mongodb://localhost:27017/test',
  REDIS_URL: 'redis://localhost:6379',
  BETTER_AUTH_SECRET: 'test-better-auth-secret',
  BETTER_AUTH_URL: 'http://localhost:3000'
}

describe('parseEnv', () => {
  it('applies defaults', () => {
    expect(parseEnv(base)).toMatchObject({ NODE_ENV: 'development', PORT: 4000 })
  })

  it('names every missing variable', () => {
    expect(() => parseEnv({})).toThrow(/MONGODB_URI.*REDIS_URL.*BETTER_AUTH_SECRET.*BETTER_AUTH_URL/)
  })

  it('treats empty values as missing', () => {
    expect(() => parseEnv({ ...base, MONGODB_URI: '' })).toThrow(/MONGODB_URI/)
    expect(parseEnv({ ...base, EDGE_SECRET: '' }).EDGE_SECRET).toBeUndefined()
  })

  it('requires the edge secret in production', () => {
    expect(() => parseEnv({ ...base, NODE_ENV: 'production' })).toThrow(/EDGE_SECRET/)
  })

  it('requires oauth and mail credentials in production only', () => {
    const production = () => parseEnv({ ...base, NODE_ENV: 'production', EDGE_SECRET: 'e'.repeat(32) })

    expect(production).toThrow(
      /AUTH_GOOGLE_ID.*AUTH_GOOGLE_SECRET.*AUTH_DISCORD_ID.*AUTH_DISCORD_SECRET.*RESEND_API_KEY.*BREVO_API_KEY/
    )
    expect(() => parseEnv(base)).not.toThrow()
  })

  it('rejects a short edge secret', () => {
    expect(() => parseEnv({ ...base, EDGE_SECRET: 'short' })).toThrow(/EDGE_SECRET/)
  })

  it('rejects a better-auth url that is not a url', () => {
    expect(() => parseEnv({ ...base, BETTER_AUTH_URL: 'nexustimer.com' })).toThrow(/BETTER_AUTH_URL/)
  })

  it('leaves realtime optional, the ticket route answers 503 without it', () => {
    const env = parseEnv(base)

    expect(env.REALTIME_URL).toBeUndefined()
    expect(env.REALTIME_SECRET).toBeUndefined()
  })
})
