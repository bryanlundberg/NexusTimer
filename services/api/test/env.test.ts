import { describe, expect, it } from 'vitest'
import { parseEnv } from '../src/config/env'

const base = { MONGODB_URI: 'mongodb://localhost:27017/test', REDIS_URL: 'redis://localhost:6379' }

describe('parseEnv', () => {
  it('applies defaults', () => {
    expect(parseEnv(base)).toMatchObject({ NODE_ENV: 'development', PORT: 4000 })
  })

  it('names every missing variable', () => {
    expect(() => parseEnv({})).toThrow(/MONGODB_URI.*REDIS_URL/)
  })

  it('treats empty values as missing', () => {
    expect(() => parseEnv({ ...base, MONGODB_URI: '' })).toThrow(/MONGODB_URI/)
    expect(parseEnv({ ...base, EDGE_SECRET: '' }).EDGE_SECRET).toBeUndefined()
  })

  it('requires the edge secret in production', () => {
    expect(() => parseEnv({ ...base, NODE_ENV: 'production' })).toThrow(/EDGE_SECRET/)
  })

  it('rejects a short edge secret', () => {
    expect(() => parseEnv({ ...base, EDGE_SECRET: 'short' })).toThrow(/EDGE_SECRET/)
  })
})
