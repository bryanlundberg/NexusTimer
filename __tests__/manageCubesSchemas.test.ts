import { deleteCollectionSchema, updateCollectionSchema } from '@/features/manage-cubes/model/schemas'

describe('deleteCollectionSchema', () => {
  it('accepts when deletion is confirmed', () => {
    expect(deleteCollectionSchema.safeParse({ confirmDeletion: true }).success).toBe(true)
  })

  it('rejects when deletion is not confirmed', () => {
    const result = deleteCollectionSchema.safeParse({ confirmDeletion: false })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('You must confirm before deleting')
    }
  })

  it('rejects a missing confirmation flag', () => {
    expect(deleteCollectionSchema.safeParse({}).success).toBe(false)
  })
})

describe('updateCollectionSchema', () => {
  it('accepts a valid name and category', () => {
    const result = updateCollectionSchema.safeParse({ name: 'My Cube', category: '3x3' })
    expect(result.success).toBe(true)
  })

  it('trims the name', () => {
    const result = updateCollectionSchema.safeParse({ name: '  My Cube  ', category: '3x3' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('My Cube')
    }
  })

  it('rejects an empty name', () => {
    const result = updateCollectionSchema.safeParse({ name: '', category: '3x3' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Name is required')
    }
  })

  it('rejects a whitespace-only name (trim runs before min)', () => {
    const result = updateCollectionSchema.safeParse({ name: '   ', category: '3x3' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Name is required')
    }
  })

  it('accepts a name longer than 50 chars (no max length)', () => {
    expect(updateCollectionSchema.safeParse({ name: 'a'.repeat(51), category: '3x3' }).success).toBe(true)
  })

  it('accepts every documented cube category', () => {
    const categories = [
      '2x2',
      '3x3',
      '3x3 OH',
      '3x3 BLD',
      '4x4',
      '4x4 BLD',
      '5x5',
      '6x6',
      '7x7',
      'SQ1',
      'Skewb',
      'Pyraminx',
      'Megaminx',
      'Clock'
    ] as const
    for (const category of categories) {
      const result = updateCollectionSchema.safeParse({ name: 'Cube', category })
      expect(result.success).toBe(true)
    }
  })

  it('rejects an unknown category', () => {
    const result = updateCollectionSchema.safeParse({ name: 'My Cube', category: '9x9' })
    expect(result.success).toBe(false)
  })
})
