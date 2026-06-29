import fs from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import meilisearch from '@/shared/config/meilisearch/meilisearch'
import { requireAdmin } from '@/shared/api/require-admin'
import { badRequest, ok, serverError } from '@/shared/api/responses'

const OUT_DIR = path.join(process.cwd(), 'scraped-products')
const INDEX = 'products'

function loadCubes(category: string | null): any[] {
  if (category) {
    const safe = category.replace(/[^a-z0-9]+/gi, '_')
    const file = path.join(OUT_DIR, `${safe}.json`)
    if (!fs.existsSync(file)) {
      throw new Error(`No file for category "${category}": ${file}`)
    }
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  }

  if (!fs.existsSync(OUT_DIR)) {
    throw new Error(`Scraped products folder not found: ${OUT_DIR}`)
  }

  return fs
    .readdirSync(OUT_DIR)
    .filter((f) => f.endsWith('.json'))
    .flatMap((f) => JSON.parse(fs.readFileSync(path.join(OUT_DIR, f), 'utf8')))
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request)
  if (denied) return denied

  try {
    const category = request.nextUrl.searchParams.get('category')
    const cubes = loadCubes(category)

    console.log(`Products${category ? ` [${category}]` : ''}:`, cubes.length)

    const documents = cubes.filter((cube: any) => {
      if (!cube.id) console.warn('Cube without id, skipping:', cube.url)
      return Boolean(cube.id)
    })

    const index = meilisearch.index(INDEX)
    const enqueued = await index.addDocuments(documents, { primaryKey: 'id' })

    const task = await meilisearch.tasks.waitForTask(enqueued.taskUid)

    if (task.status !== 'succeeded') {
      console.error('Ingestion task failed:', task.error)
      return NextResponse.json({ message: 'Ingestion task failed', task }, { status: 500 })
    }

    return ok(task)
  } catch (error) {
    return serverError('admin/ingestion/products:POST', error)
  }
}

export async function DELETE(request: NextRequest) {
  const denied = requireAdmin(request)
  if (denied) return denied

  try {
    const index = meilisearch.index(INDEX)
    const category = request.nextUrl.searchParams.get('category')

    if (category) {
      const ids = loadCubes(category)
        .map((cube: any) => cube.id)
        .filter(Boolean)

      if (ids.length === 0) return badRequest(`No ids found for category "${category}"`)

      const enqueued = await index.deleteDocuments(ids)
      const task = await meilisearch.tasks.waitForTask(enqueued.taskUid)

      if (task.status !== 'succeeded') {
        console.error('Delete task failed:', task.error)
        return NextResponse.json({ message: 'Delete task failed', task }, { status: 500 })
      }

      return ok({ deleted: ids.length, category, task })
    }

    // No category -> clear the whole index.
    const enqueued = await index.deleteAllDocuments()
    const task = await meilisearch.tasks.waitForTask(enqueued.taskUid)

    if (task.status !== 'succeeded') {
      console.error('Delete task failed:', task.error)
      return NextResponse.json({ message: 'Delete task failed', task }, { status: 500 })
    }

    return ok({ deletedAll: true, task })
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
