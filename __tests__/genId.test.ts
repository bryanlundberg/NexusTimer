import genId from '@/shared/lib/genId'

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

describe('genId', () => {
  it('returns unique v4 uuids', () => {
    const ids = Array.from({ length: 500 }, () => genId())

    for (const id of ids) expect(id).toMatch(UUID_V4)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
