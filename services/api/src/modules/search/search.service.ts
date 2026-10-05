import type { ProductHit, SearchIndex, SearchResponse } from '@nexustimer/contracts'
import type { SearchEngine } from '../../infra/search'

const PUBLIC_ATTRIBUTES: Record<SearchIndex, string[]> = {
  products: ['id', 'name', 'brand', 'category', 'image', 'url']
}

export type SearchService = {
  search(request: { index: SearchIndex; query: string; limit: number }): Promise<SearchResponse<ProductHit>>
}

export function createSearchService(engine: SearchEngine): SearchService {
  return {
    async search({ index, query, limit }) {
      const result = await engine({ index, query, limit, attributes: PUBLIC_ATTRIBUTES[index] })
      return {
        query: result.query,
        hits: result.hits as ProductHit[],
        estimatedTotalHits: result.estimatedTotalHits ?? result.hits.length
      }
    }
  }
}
