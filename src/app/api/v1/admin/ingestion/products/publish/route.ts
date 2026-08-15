import { NextRequest, NextResponse } from 'next/server'
import meilisearch from '@/shared/config/meilisearch/meilisearch'
import { requireAdmin } from '@/shared/api/require-admin'
import { ok, serverError } from '@/shared/api/responses'
import connectDB from '@/shared/config/mongodb/mongodb'
import Product from '@/entities/product/model/product'
import type { ProductDocument } from '@/entities/product/model/product'

const INDEX = 'products'

// The client defaults to 5s, which is short for a whole catalog in one task.
const TASK_TIMEOUT = 120_000

type PublishableProduct = Pick<ProductDocument, '_id' | 'url' | 'category' | 'name' | 'brand' | 'image' | 'specs'>

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request)
  if (denied) return denied

  try {
    await connectDB()

    const pending = await Product.find(
      { status: 'scraped' },
      { url: 1, category: 1, name: 1, brand: 1, image: 1, specs: 1 }
    ).lean<PublishableProduct[]>()

    if (pending.length === 0) return ok({ published: 0 })

    const documents = pending.map(({ _id, url, category, name, brand, image, specs }) => ({
      id: _id,
      url,
      category,
      name,
      brand,
      image,
      specs
    }))

    const enqueued = await meilisearch.index(INDEX).addDocuments(documents, { primaryKey: 'id' })
    const task = await meilisearch.tasks.waitForTask(enqueued.taskUid, { timeout: TASK_TIMEOUT })

    if (task.status !== 'succeeded') {
      return NextResponse.json({ message: 'Ingestion task failed', task }, { status: 500 })
    }

    await Product.updateMany(
      { _id: { $in: pending.map((product) => product._id) } },
      { $set: { status: 'published', publishedAt: new Date() } }
    )

    return ok({ published: documents.length })
  } catch (error) {
    return serverError('admin/ingestion/products/publish:POST', error)
  }
}
