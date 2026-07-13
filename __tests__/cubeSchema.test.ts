import { createCubeFormSchema, editCubeFormSchema } from '@/entities/cube/model/schema'

describe('createCubeFormSchema', () => {
  it('accepts a valid name and category', () => {
    expect(createCubeFormSchema.safeParse({ name: 'My Cube', category: '3x3' }).success).toBe(true)
  })

  it('accepts a single-character name', () => {
    expect(createCubeFormSchema.safeParse({ name: 'A', category: '3x3' }).success).toBe(true)
  })

  it('accepts a 50-character name', () => {
    expect(createCubeFormSchema.safeParse({ name: 'a'.repeat(50), category: '3x3' }).success).toBe(true)
  })

  it('rejects an empty name', () => {
    const result = createCubeFormSchema.safeParse({ name: '', category: '3x3' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Required collection name')
    }
  })

  it('accepts a name longer than 50 chars (no max length)', () => {
    expect(createCubeFormSchema.safeParse({ name: 'a'.repeat(51), category: '3x3' }).success).toBe(true)
  })

  it('rejects an unknown category', () => {
    expect(createCubeFormSchema.safeParse({ name: 'My Cube', category: '9x9' }).success).toBe(false)
  })
})

describe('editCubeFormSchema', () => {
  it('accepts a valid payload with id, name, and category', () => {
    expect(editCubeFormSchema.safeParse({ id: 'cube-1', name: 'My Cube', category: '3x3' }).success).toBe(true)
  })

  it('rejects when the id is missing', () => {
    const result = editCubeFormSchema.safeParse({ name: 'My Cube', category: '3x3' } as unknown as never)
    expect(result.success).toBe(false)
  })

  it('rejects an empty id', () => {
    const result = editCubeFormSchema.safeParse({ id: '', name: 'My Cube', category: '3x3' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const idIssue = result.error.issues.find((i) => i.path[0] === 'id')
      expect(idIssue?.message).toBe('Invalid cube ID')
    }
  })

  it('still enforces the inherited name and category rules', () => {
    expect(editCubeFormSchema.safeParse({ id: 'cube-1', name: '', category: '3x3' }).success).toBe(false)
    expect(editCubeFormSchema.safeParse({ id: 'cube-1', name: 'My Cube', category: '9x9' }).success).toBe(false)
  })
})
