import { NextRequest } from 'next/server'
import meilisearch from '@/shared/config/meilisearch/meilisearch'
import { badRequest, ok, serverError } from '@/shared/api/responses'

const INDEXES: Record<string, { attributesToRetrieve: string[] }> = {
  products: {
    attributesToRetrieve: ['id', 'name', 'brand', 'category', 'image', 'url']
  }
}

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams
    const q = params.get('q') ?? ''
    const index = params.get('index') ?? 'products'
    const limit = Math.min(Math.max(Number(params.get('limit')) || 8, 1), 20)

    const config = INDEXES[index]
    if (!config) return badRequest(`Unknown search index "${index}"`)

    const result = await meilisearch.index(index).search(q, {
      limit,
      attributesToRetrieve: config.attributesToRetrieve
    })

    return ok({
      query: result.query,
      hits: result.hits,
      estimatedTotalHits: result.estimatedTotalHits ?? result.hits.length
    })
  } catch (error) {
    return serverError('search:GET', error)
  }
}
