import { NextRequest } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/shared/api/require-admin'
import { parseJsonBody } from '@/shared/api/parse-json'
import { ok, serverError } from '@/shared/api/responses'
import connectDB from '@/shared/config/mongodb/mongodb'
import Product from '@/entities/product/model/product'
import { CUBE_CATEGORIES } from '@/shared/const/cube-categories'

const bodySchema = z
  .array(
    z.object({
      id: z.string().min(1),
      url: z.string().url(),
      collectionSlug: z.string().min(1),
      category: z.enum(CUBE_CATEGORIES)
    })
  )
  .min(1)

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request)
  if (denied) return denied

  try {
    const products = await parseJsonBody(request, bodySchema)
    if (products instanceof Response) return products

    await connectDB()

    const now = new Date()

    const result = await Product.bulkWrite(
      products.map(({ id, url, collectionSlug, category }) => ({
        updateOne: {
          filter: { _id: id },
          update: {
            $setOnInsert: { url, collectionSlug, category, status: 'discovered', attempts: 0 },
            $set: { lastSeenAt: now }
          },
          upsert: true
        }
      })),
      { ordered: false }
    )

    return ok({ received: products.length, inserted: result.upsertedCount })
  } catch (error) {
    return serverError('admin/ingestion/products/discovered:POST', error)
  }
}
