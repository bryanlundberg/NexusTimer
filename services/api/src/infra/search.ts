import { Meilisearch } from 'meilisearch'

const REQUEST_TIMEOUT_MS = 5000
const ADMIN_REQUEST_TIMEOUT_MS = 60_000

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

export type SearchTask = { status: string } & Record<string, unknown>

export type SearchAdmin = {
  addDocuments(index: string, documents: Record<string, unknown>[], waitTimeoutMs?: number): Promise<SearchTask>
  deleteIndex(index: string): Promise<SearchTask>
  stats(index: string): Promise<unknown>
}

export function createSearchAdmin({ host, apiKey }: { host?: string; apiKey?: string }): SearchAdmin {
  const client = host ? new Meilisearch({ host, apiKey, timeout: ADMIN_REQUEST_TIMEOUT_MS }) : null
  const configured = () => {
    if (!client) throw new Error('MEILISEARCH_HOST is not configured')
    return client
  }

  return {
    async addDocuments(index, documents, waitTimeoutMs) {
      const meili = configured()
      const enqueued = await meili.index(index).addDocuments(documents, { primaryKey: 'id' })
      return meili.tasks.waitForTask(enqueued.taskUid, waitTimeoutMs ? { timeout: waitTimeoutMs } : undefined)
    },
    async deleteIndex(index) {
      const meili = configured()
      const enqueued = await meili.deleteIndex(index)
      return meili.tasks.waitForTask(enqueued.taskUid)
    },
    stats: (index) => configured().index(index).getStats()
  }
}
