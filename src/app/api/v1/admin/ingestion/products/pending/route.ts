import { NextRequest } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/shared/api/require-admin'
import { parseSearchParams } from '@/shared/api/parse-query'
import { ok, serverError } from '@/shared/api/responses'
import connectDB from '@/shared/config/mongodb/mongodb'
import Product from '@/entities/product/model/product'
import { CUBE_CATEGORIES } from '@/shared/const/cube-categories'

const querySchema = z.object({
  category: z.enum(CUBE_CATEGORIES),
  limit: z.coerce.number().int().positive().max(5000).default(5000)
})

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request)
  if (denied) return denied

  try {
    const query = parseSearchParams(request, querySchema)
    if (query instanceof Response) return query

    await connectDB()

    const products = await Product.find({ category: query.category, status: 'discovered' }, { url: 1 })
      .limit(query.limit)
      .lean<Array<{ _id: string; url: string }>>()

    return ok({ products: products.map(({ _id, url }) => ({ id: _id, url })) })
  } catch (error) {
    return serverError('admin/ingestion/products/pending:GET', error)
  }
}
