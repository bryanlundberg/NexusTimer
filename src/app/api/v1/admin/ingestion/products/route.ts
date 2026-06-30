import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import meilisearch from '@/shared/config/meilisearch/meilisearch'
import { requireAdmin } from '@/shared/api/require-admin'
import { parseJsonBody } from '@/shared/api/parse-json'
import { badRequest, ok, serverError } from '@/shared/api/responses'

const INDEX = 'products'

const productSchema = z.object({ id: z.string().min(1) }).passthrough()

const ingestSchema = z
  .union([z.array(productSchema), z.object({ documents: z.array(productSchema) })])
  .transform((body) => (Array.isArray(body) ? body : body.documents))

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request)
  if (denied) return denied

  try {
    const documents = await parseJsonBody(request, ingestSchema)
    if (documents instanceof Response) return documents

    if (documents.length === 0) return badRequest('No documents to index')

    const index = meilisearch.index(INDEX)
    const enqueued = await index.addDocuments(documents, { primaryKey: 'id' })
    const task = await meilisearch.tasks.waitForTask(enqueued.taskUid)

    if (task.status !== 'succeeded') {
      return NextResponse.json({ message: 'Ingestion task failed', task }, { status: 500 })
    }

    return ok({ indexed: documents.length, task })
  } catch (error) {
    return serverError('admin/ingestion/products:POST', error)
  }
}

export async function DELETE(request: NextRequest) {
  const denied = requireAdmin(request)
  if (denied) return denied

  try {
    const index = request.nextUrl.searchParams.get('index')
    if (index !== INDEX) {
      return badRequest(`Pass ?index=${INDEX} to confirm deleting the index`)
    }

    const enqueued = await meilisearch.deleteIndex(INDEX)
    const task = await meilisearch.tasks.waitForTask(enqueued.taskUid)

    if (task.status !== 'succeeded') {
      console.error('Delete index task failed:', task.error)
      return NextResponse.json({ message: 'Delete index task failed', task }, { status: 500 })
    }

    return ok({ deletedIndex: INDEX, task })
  } catch (error) {
    return serverError('admin/ingestion/products:DELETE', error)
  }
}

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request)
  if (denied) return denied

  try {
    return ok({ stats: await meilisearch.index(INDEX).getStats() })
  } catch (error) {
    return serverError('admin/ingestion/products:GET', error)
  }
}
