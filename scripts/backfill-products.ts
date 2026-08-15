import mongoose from 'mongoose'
import connectDB from '@/shared/config/mongodb/mongodb'
import meilisearch from '@/shared/config/meilisearch/meilisearch'
import Product from '@/entities/product/model/product'
import { isValidCategory } from '@/shared/const/cube-categories'

const INDEX = 'products'
const PAGE = 1000

type IndexedProduct = {
  id?: string
  url?: string
  category?: string
  name?: string | null
  brand?: string[]
  image?: string | null
  specs?: Record<string, unknown>
}

function resolveSlug(url: string): string | null {
  return url.match(/\/collections\/([^/]+)\/products\//)?.[1]?.toLowerCase() ?? null
}

async function main() {
  const connected = await connectDB()
  if (!connected) throw new Error('Could not connect to MongoDB, is MONGODB_URI set?')

  const index = meilisearch.index(INDEX)
  const now = new Date()

  let offset = 0
  let seeded = 0
  let skipped = 0

  while (true) {
    const { results } = await index.getDocuments<IndexedProduct>({ limit: PAGE, offset })
    if (results.length === 0) break

    const rows = results.flatMap((document) => {
      const slug = document.url ? resolveSlug(document.url) : null

      if (!document.id || !document.url || !slug || !document.category || !isValidCategory(document.category)) {
        return []
      }

      return [
        {
          _id: document.id,
          url: document.url,
          collectionSlug: slug,
          category: document.category,
          status: 'published',
          name: document.name ?? null,
          brand: document.brand ?? [],
          image: document.image ?? null,
          specs: document.specs ?? {},
          attempts: 0,
          publishedAt: now,
          lastSeenAt: now
        }
      ]
    })

    skipped += results.length - rows.length

    if (rows.length > 0) {
      const written = await Product.bulkWrite(
        rows.map(({ _id, ...fields }) => ({
          updateOne: { filter: { _id }, update: { $setOnInsert: fields }, upsert: true }
        })),
        { ordered: false }
      )

      seeded += written.upsertedCount
    }

    offset += results.length
    console.log(`  ${offset} documents read`)
  }

  console.log(`\nSeeded ${seeded}, skipped ${skipped}, products in DB: ${await Product.countDocuments()}`)

  await mongoose.disconnect()
}

main().catch(async (error) => {
  console.error(error)
  await mongoose.disconnect().catch(() => {})
  process.exit(1)
})
