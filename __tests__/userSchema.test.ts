import { userSchema } from '@/entities/user/model/types'

const validUser = {
  _id: 'u1',
  name: 'Bryan',
  email: 'a@b.co',
  image: 'https://example.com/avatar.png'
}

describe('userSchema', () => {
  it('accepts a user with all required fields', () => {
    expect(userSchema.safeParse(validUser).success).toBe(true)
  })

  it('accepts every optional field set', () => {
    const result = userSchema.safeParse({
      ...validUser,
      pronoun: 'he/him',
      timezone: 'America/Argentina/Buenos_Aires',
      goal: 'Sub-15',
      bio: 'speedcuber'
    })
    expect(result.success).toBe(true)
  })

  it.each(['_id', 'name', 'email', 'image'] as const)('rejects when %s is missing', (field) => {
    const payload = { ...validUser } as Record<string, unknown>
    delete payload[field]
    const result = userSchema.safeParse(payload)
    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === field)
      expect(issue).toBeDefined()
    }
  })

  it('rejects when _id is not a string', () => {
    expect(userSchema.safeParse({ ...validUser, _id: 123 }).success).toBe(false)
  })

  it('rejects an invalid email format', () => {
    const result = userSchema.safeParse({ ...validUser, email: 'not-an-email' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === 'email')
      expect(issue).toBeDefined()
    }
  })

  it('rejects an empty email', () => {
    expect(userSchema.safeParse({ ...validUser, email: '' }).success).toBe(false)
  })

  it('strips unknown keys by default', () => {
    const result = userSchema.safeParse({ ...validUser, extraField: 'should be dropped' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).not.toHaveProperty('extraField')
    }
  })
})
