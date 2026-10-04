import { Meilisearch } from 'meilisearch'

const REQUEST_TIMEOUT_MS = 5000

export type SearchRequest = { index: string; query: string; limit: number; attributes: string[] }
export type SearchResult = { query: string; hits: Record<string, unknown>[]; estimatedTotalHits?: number }
export type SearchEngine = (request: SearchRequest) => Promise<SearchResult>

export function createSearchEngine({ host, apiKey }: { host?: string; apiKey?: string }): SearchEngine {
  if (!host) return () => Promise.reject(new Error('MEILISEARCH_HOST is not configured'))

  const client = new Meilisearch({ host, apiKey, timeout: REQUEST_TIMEOUT_MS })

  return async ({ index, query, limit, attributes }) => {
    const result = await client.index(index).search(query, { limit, attributesToRetrieve: attributes })
    return { query: result.query, hits: result.hits, estimatedTotalHits: result.estimatedTotalHits }
  }
}
