import * as z from 'zod'

export const SEARCH_INDEXES = ['products'] as const

export type SearchIndex = (typeof SEARCH_INDEXES)[number]

export const SEARCH_DEFAULT_LIMIT = 8
export const SEARCH_MAX_LIMIT = 20

export const productHitSchema = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.array(z.string()).nullable().optional(),
  category: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  url: z.string().nullable().optional()
})

export type ProductHit = z.infer<typeof productHitSchema>

export type SearchResponse<T = ProductHit> = {
  query: string
  hits: T[]
  estimatedTotalHits: number
}

export function isSearchIndex(value: string): value is SearchIndex {
  return (SEARCH_INDEXES as readonly string[]).includes(value)
}

export function clampSearchLimit(raw: string | null | undefined) {
  return Math.min(Math.max(Number(raw) || SEARCH_DEFAULT_LIMIT, 1), SEARCH_MAX_LIMIT)
}
