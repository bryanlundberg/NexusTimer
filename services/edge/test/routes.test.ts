import { describe, expect, it } from 'vitest'
import { isApiPath } from '../src/routes'

describe('isApiPath', () => {
  it('matches the api root and everything below it', () => {
    expect(isApiPath('/api')).toBe(true)
    expect(isApiPath('/api/health/ready')).toBe(true)
    expect(isApiPath('/api/auth/get-session')).toBe(true)
    expect(isApiPath('/api/v1/chats')).toBe(true)
  })

  it('does not match on a partial segment', () => {
    expect(isApiPath('/apis')).toBe(false)
    expect(isApiPath('/api-docs')).toBe(false)
  })

  it('leaves pages alone', () => {
    expect(isApiPath('/')).toBe(false)
    expect(isApiPath('/es/app')).toBe(false)
  })
})
