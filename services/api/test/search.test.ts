import { describe, expect, it, vi } from 'vitest'
import type { SearchEngine } from '../src/infra/search'
import { createSearchService } from '../src/modules/search/search.service'
import { buildTestApp } from './helpers'

const hit = { id: 'gan-12', name: 'GAN 12 Maglev', brand: ['GAN'], category: '3x3', image: null, url: null }

function appWithEngine(engine: SearchEngine) {
  return buildTestApp({ search: createSearchService(engine) })
}

describe('GET /api/v1/search', () => {
  it('searches products with the public attributes and the default limit', async () => {
    const engine = vi.fn<SearchEngine>(() => Promise.resolve({ query: 'gan', hits: [hit], estimatedTotalHits: 42 }))

    const res = await appWithEngine(engine).request('/api/v1/search?q=gan')

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ query: 'gan', hits: [hit], estimatedTotalHits: 42 })
    expect(engine).toHaveBeenCalledWith({
      index: 'products',
      query: 'gan',
      limit: 8,
      attributes: ['id', 'name', 'brand', 'category', 'image', 'url']
    })
  })

  it.each([
    ['50', 20],
    ['-5', 1],
    ['0', 8],
    ['abc', 8],
    ['12', 12]
  ])('clamps limit=%s to %i', async (limit, expected) => {
    const engine = vi.fn<SearchEngine>(() => Promise.resolve({ query: '', hits: [] }))

    await appWithEngine(engine).request(`/api/v1/search?index=products&limit=${limit}`)

    expect(engine.mock.calls[0]?.[0]).toMatchObject({ query: '', limit: expected })
  })

  it('falls back to the hit count when the engine has no estimate', async () => {
    const engine: SearchEngine = () => Promise.resolve({ query: 'gan', hits: [hit, hit] })

    const res = await appWithEngine(engine).request('/api/v1/search?q=gan')

    expect(await res.json()).toMatchObject({ estimatedTotalHits: 2 })
  })

  it('rejects an unknown index', async () => {
    const engine = vi.fn<SearchEngine>()

    const res = await appWithEngine(engine).request('/api/v1/search?index=users&q=ana')

    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ message: 'Unknown search index "users"' })
    expect(engine).not.toHaveBeenCalled()
  })

  it('hides engine failures behind a 500', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const res = await appWithEngine(() => Promise.reject(new Error('meilisearch down'))).request('/api/v1/search?q=gan')

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ message: 'Internal server error' })
  })
})
