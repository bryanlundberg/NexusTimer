import { clampSearchLimit, isSearchIndex, type SearchResponse } from '@nexustimer/contracts'
import { Hono } from 'hono'
import { badRequest, ok, serverError } from '../../http/responses'
import type { AppEnv } from '../../http/types'
import type { SearchService } from './search.service'

export function searchRoutes(search: SearchService) {
  return new Hono<AppEnv>().get('/', async (c) => {
    const index = c.req.query('index') ?? 'products'
    if (!isSearchIndex(index)) return badRequest(`Unknown search index "${index}"`)

    try {
      const result = await search.search({
        index,
        query: c.req.query('q') ?? '',
        limit: clampSearchLimit(c.req.query('limit'))
      })
      return ok<SearchResponse>(result)
    } catch (error) {
      return serverError('search:GET', error)
    }
  })
}
