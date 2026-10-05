import type { CubeCategory, DiscoveredProduct, ScrapeResult } from '@nexustimer/contracts'
import { ProductModel } from './products.model'

export type PendingProduct = { id: string; url: string }

export type PublishableProduct = {
  id: string
  url: string
  category: CubeCategory
  name: string | null
  brand: string[]
  image: string | null
  specs: Record<string, unknown>
}

export type ProductsRepository = {
  discover(products: DiscoveredProduct[], seenAt: Date): Promise<number>
  pending(category: CubeCategory, limit: number): Promise<PendingProduct[]>
  recordScrapes(results: ScrapeResult[], scrapedAt: Date): Promise<number>
  scraped(): Promise<PublishableProduct[]>
  markPublished(ids: string[], publishedAt: Date): Promise<void>
}

type RawPublishable = Omit<PublishableProduct, 'id'> & { _id: string }

export const productsRepository: ProductsRepository = {
  async discover(products, seenAt) {
    const result = await ProductModel.bulkWrite(
      products.map(({ id, url, collectionSlug, category }) => ({
        updateOne: {
          filter: { _id: id },
          update: {
            $setOnInsert: { url, collectionSlug, category, status: 'discovered', attempts: 0 },
            $set: { lastSeenAt: seenAt }
          },
          upsert: true
        }
      })),
      { ordered: false }
    )
    return result.upsertedCount
  },

  async pending(category, limit) {
    const docs = await ProductModel.find({ category, status: 'discovered' }, { url: 1 })
      .limit(limit)
      .lean<{ _id: string; url: string }[]>()
    return docs.map(({ _id, url }) => ({ id: _id, url }))
  },

  async recordScrapes(results, scrapedAt) {
    const written = await ProductModel.bulkWrite(
      results.map((result) =>
        'error' in result
          ? {
              updateOne: {
                filter: { _id: result.id },
                update: { $inc: { attempts: 1 }, $set: { lastError: result.error } }
              }
            }
          : {
              updateOne: {
                filter: { _id: result.id },
                update: {
                  $set: {
                    name: result.name,
                    brand: result.brand,
                    image: result.image,
                    specs: result.specs,
                    status: 'scraped',
                    scrapedAt
                  },
                  $unset: { lastError: '' }
                }
              }
            }
      ),
      { ordered: false }
    )
    return written.matchedCount
  },

  async scraped() {
    const docs = await ProductModel.find(
      { status: 'scraped' },
      { url: 1, category: 1, name: 1, brand: 1, image: 1, specs: 1 }
    ).lean<RawPublishable[]>()
    return docs.map(({ _id, url, category, name, brand, image, specs }) => ({
      id: _id,
      url,
      category,
      name,
      brand,
      image,
      specs
    }))
  },

  async markPublished(ids, publishedAt) {
    await ProductModel.updateMany({ _id: { $in: ids } }, { $set: { status: 'published', publishedAt } })
  }
}
