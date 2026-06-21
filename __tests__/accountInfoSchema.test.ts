import { accountInfoSchema } from '@/features/account-form/model/types'

describe('accountInfoSchema', () => {
  it('accepts a minimal payload with only name', () => {
    expect(accountInfoSchema.safeParse({ name: 'Bryan' }).success).toBe(true)
  })

  it('accepts a full payload with every optional field set', () => {
    const result = accountInfoSchema.safeParse({
      name: 'Bryan',
      timezone: 'America/Argentina/Buenos_Aires',
      pronoun: 'he/him',
      goal: 'Sub-15',
      bio: 'speedcuber'
    })
    expect(result.success).toBe(true)
  })

  it('rejects a name shorter than 3 chars', () => {
    const result = accountInfoSchema.safeParse({ name: 'Ab' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Name must be at least 3 characters long')
    }
  })

  it('rejects when name is missing', () => {
    const result = accountInfoSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('allows empty strings for optional fields', () => {
    expect(accountInfoSchema.safeParse({ name: 'Bryan', bio: '', goal: '' }).success).toBe(true)
  })
})
