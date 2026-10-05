import { CUBE_CATEGORIES } from '@nexustimer/contracts'
import { Schema, model } from 'mongoose'

export const PRODUCT_STATUSES = ['discovered', 'scraped', 'published'] as const

const productSchema = new Schema(
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

productSchema.index({ category: 1, status: 1 })

export const ProductModel = model('Product', productSchema)
