import { Schema, models, model } from 'mongoose'
import { CUBE_CATEGORIES, type CubeCategory } from '@/shared/const/cube-categories'

export const PRODUCT_STATUSES = ['discovered', 'scraped', 'published'] as const

export type ProductStatus = (typeof PRODUCT_STATUSES)[number]

/** `_id` is the product handle, the slug in `/products/<handle>`, and doubles as the Meilisearch id. */
export interface ProductDocument {
  _id: string
  url: string
  collectionSlug: string
  category: CubeCategory
  status: ProductStatus
  name: string | null
  brand: string[]
  image: string | null
  specs: Record<string, unknown>
  attempts: number
  lastError?: string
  scrapedAt?: Date
  publishedAt?: Date
  lastSeenAt?: Date
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema(
  {
    _id: { type: String },
    url: { type: String, required: true, unique: true },
    collectionSlug: { type: String, required: true },
    category: { type: String, enum: [...CUBE_CATEGORIES], required: true },
    status: { type: String, enum: [...PRODUCT_STATUSES], required: true, default: 'discovered' },
    name: { type: String, default: null },
    brand: { type: [String], default: [] },
    image: { type: String, default: null },
    specs: { type: Schema.Types.Mixed, default: {} },
    attempts: { type: Number, required: true, default: 0 },
    lastError: { type: String },
    scrapedAt: { type: Date },
    publishedAt: { type: Date },
    lastSeenAt: { type: Date }
  },
  { timestamps: true, _id: false }
)

ProductSchema.index({ category: 1, status: 1 })

export default models.Product || model('Product', ProductSchema)
