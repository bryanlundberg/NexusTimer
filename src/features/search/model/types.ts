export type SearchIndex = 'products'

export interface ProductHit {
  id: string
  name: string
  brand?: string[] | null
  category?: string | null
  image?: string | null
  url?: string | null
}

export interface SearchResponse<T = ProductHit> {
  query: string
  hits: T[]
  estimatedTotalHits: number
}
