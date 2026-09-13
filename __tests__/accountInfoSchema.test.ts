import { accountInfoSchema, mainColorsSchema, profileLinksSchema } from '@/features/account-form/model/types'

describe('accountInfoSchema', () => {
  it('accepts a minimal payload with only name', () => {
    expect(accountInfoSchema.safeParse({ name: 'Mateo' }).success).toBe(true)
  })

  it('accepts a full payload with every optional field set', () => {
    const result = accountInfoSchema.safeParse({
      name: 'Mateo',
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
    expect(accountInfoSchema.safeParse({ name: 'Mateo', bio: '', goal: '', method: '' }).success).toBe(true)
  })

  it('accepts several main colors and rejects colors that are not cube faces', () => {
    expect(accountInfoSchema.safeParse({ name: 'Mateo', mainColors: ['white', 'yellow'] }).success).toBe(true)
    expect(accountInfoSchema.safeParse({ name: 'Mateo', mainColors: ['purple'] }).success).toBe(false)
  })

  it('accepts a known method and rejects an unknown one', () => {
    expect(accountInfoSchema.safeParse({ name: 'Mateo', method: 'roux' }).success).toBe(true)
    expect(accountInfoSchema.safeParse({ name: 'Mateo', method: 'freestyle' }).success).toBe(false)
  })

  it('allows blank link rows but rejects links that are not web URLs', () => {
    expect(accountInfoSchema.safeParse({ name: 'Mateo', links: [{ url: '' }, { url: 'twitch.tv/me' }] }).success).toBe(
      true
    )
    expect(accountInfoSchema.safeParse({ name: 'Mateo', links: [{ url: 'javascript:alert(1)' }] }).success).toBe(false)
  })
})

describe('mainColorsSchema', () => {
  it('dedupes and orders colors the way the profile lists them', () => {
    expect(mainColorsSchema.parse(['yellow', 'white', 'yellow'])).toEqual(['white', 'yellow'])
  })
})

describe('profileLinksSchema', () => {
  it('normalizes and dedupes links', () => {
    expect(profileLinksSchema.parse(['instagram.com/nexus', 'https://instagram.com/nexus'])).toEqual([
      'https://instagram.com/nexus'
    ])
  })

  it('rejects more than the allowed number of links', () => {
    expect(profileLinksSchema.safeParse(Array.from({ length: 6 }, (_, i) => `site${i}.com`)).success).toBe(false)
  })
})
