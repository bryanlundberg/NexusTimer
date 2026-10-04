import { type CubeCategory, type DiscoveredProduct, PRODUCTS_INDEX, type ScrapeResult } from '@nexustimer/contracts'
import type { SearchAdmin, SearchTask } from '../../infra/search'
import type { PendingProduct, ProductsRepository } from './products.repository'

const PUBLISH_TASK_TIMEOUT_MS = 120_000

export type IndexResult = { ok: boolean; task: SearchTask }

export type ProductsService = {
  index(documents: Record<string, unknown>[]): Promise<IndexResult>
  deleteIndex(): Promise<IndexResult>
  stats(): Promise<unknown>
  discover(products: DiscoveredProduct[]): Promise<{ received: number; inserted: number }>
  pending(category: CubeCategory, limit: number): Promise<PendingProduct[]>
  recordScrapes(results: ScrapeResult[]): Promise<{ scraped: number; failed: number; matched: number }>
  publish(): Promise<{ published: number } | { failed: SearchTask }>
}

type ProductsDeps = { repository: ProductsRepository; search: SearchAdmin; now?: () => Date }

const succeeded = (task: SearchTask): IndexResult => ({ ok: task.status === 'succeeded', task })

export function createProductsService({ repository, search, now = () => new Date() }: ProductsDeps): ProductsService {
  return {
    async index(documents) {
      return succeeded(await search.addDocuments(PRODUCTS_INDEX, documents))
    },

    async deleteIndex() {
      return succeeded(await search.deleteIndex(PRODUCTS_INDEX))
    },

    stats: () => search.stats(PRODUCTS_INDEX),

    async discover(products) {
      return { received: products.length, inserted: await repository.discover(products, now()) }
    },

    pending: (category, limit) => repository.pending(category, limit),

    async recordScrapes(results) {
      const matched = await repository.recordScrapes(results, now())
      const failed = results.filter((result) => 'error' in result).length
      return { scraped: results.length - failed, failed, matched }
    },

    async publish() {
      const pending = await repository.scraped()
      if (pending.length === 0) return { published: 0 }

      const task = await search.addDocuments(PRODUCTS_INDEX, pending, PUBLISH_TASK_TIMEOUT_MS)
      if (task.status !== 'succeeded') return { failed: task }

      await repository.markPublished(
        pending.map((product) => product.id),
        now()
      )
      return { published: pending.length }
    }
  }
}
