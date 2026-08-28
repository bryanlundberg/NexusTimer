import { NextRequest } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/shared/api/require-admin'
import { parseJsonBody } from '@/shared/api/parse-json'
import { ok, serverError } from '@/shared/api/responses'
import connectDB from '@/shared/config/mongodb/mongodb'
import Product from '@/entities/product/model/product'

const failureSchema = z.object({
  id: z.string().min(1),
  error: z.string().min(1)
})

const successSchema = z.object({
  id: z.string().min(1),
  name: z.string().nullable().default(null),
  brand: z.array(z.string()).default([]),
  image: z.string().nullable().default(null),
  specs: z.record(z.string(), z.unknown()).default({})
})

const bodySchema = z.array(z.union([failureSchema, successSchema])).min(1)

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request)
  if (denied) return denied

  try {
    const results = await parseJsonBody(request, bodySchema)
    if (results instanceof Response) return results

    await connectDB()

    const now = new Date()

    const operations = results.map((result) =>
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
                  scrapedAt: now
                },
                $unset: { lastError: '' }
              }
            }
          }
    )

    const written = await Product.bulkWrite(operations, { ordered: false })
    const failed = results.filter((result) => 'error' in result).length

    return ok({ scraped: results.length - failed, failed, matched: written.matchedCount })
  } catch (error) {
    return serverError('admin/ingestion/products/scraped:POST', error)
  }
}
