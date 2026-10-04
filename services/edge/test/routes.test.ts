import { describe, expect, it } from 'vitest'
import { isMigratedApiPath } from '../src/routes'

describe('isMigratedApiPath', () => {
  it('matches a migrated prefix and its sub paths', () => {
    expect(isMigratedApiPath('/api/health')).toBe(true)
    expect(isMigratedApiPath('/api/health/ready')).toBe(true)
  })

  it('does not match on a partial segment', () => {
    expect(isMigratedApiPath('/api/healthz')).toBe(false)
  })

  it('leaves routes that still live in Next untouched', () => {
    expect(isMigratedApiPath('/api/v1/chats')).toBe(false)
    expect(isMigratedApiPath('/api/auth/get-session')).toBe(false)
  })
})
