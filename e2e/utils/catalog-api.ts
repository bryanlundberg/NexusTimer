import type { CubeCategory } from '@/shared/const/cube-categories'

export interface DiscoveredProduct {
  id: string
  url: string
  collectionSlug: string
  category: CubeCategory
}

export type ScrapedProduct =
  | { id: string; name: string | null; brand: string[]; image: string | null; specs: Record<string, unknown> }
  | { id: string; error: string }

const CHUNK = 500

function target() {
  const baseUrl = process.env.INGESTION_BASE_URL?.replace(/\/$/, '')
  const token = process.env.ADMIN_TOKEN

  if (!baseUrl || !token) {
    throw new Error('INGESTION_BASE_URL and ADMIN_TOKEN are required to reach the catalog endpoints')
  }

  return { baseUrl, token }
}

async function request<T>(path: string, body?: unknown): Promise<T> {
  const { baseUrl, token } = target()

  const response = await fetch(`${baseUrl}/api/v1/admin/ingestion/products${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: { 'content-type': 'application/json', 'x-admin-token': token },
    body: body === undefined ? undefined : JSON.stringify(body)
  })

  if (!response.ok) throw new Error(`${path} responded HTTP ${response.status}: ${await response.text()}`)

  return response.json() as Promise<T>
}

export async function saveDiscovered(products: DiscoveredProduct[]) {
  let received = 0
  let inserted = 0

  for (let i = 0; i < products.length; i += CHUNK) {
    const result = await request<{ received: number; inserted: number }>('/discovered', products.slice(i, i + CHUNK))
    received += result.received
    inserted += result.inserted
  }

  return { received, inserted }
}

export async function fetchPending(category: CubeCategory) {
  const result = await request<{ products: Array<{ id: string; url: string }> }>(
    `/pending?category=${encodeURIComponent(category)}`
  )

  return result.products
}

export async function saveScraped(results: ScrapedProduct[]) {
  for (let i = 0; i < results.length; i += CHUNK) {
    await request('/scraped', results.slice(i, i + CHUNK))
  }
}
