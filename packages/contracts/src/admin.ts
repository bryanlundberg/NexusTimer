import { z } from 'zod'
import { CUBE_CATEGORIES } from './cube-categories'

export const ADMIN_TOKEN_HEADER = 'x-admin-token'

export const GRANTED_ACHIEVEMENT_KEYS = ['public-sponsor', 'contributor', 'bug-hunter', 'playstore-beta'] as const

export type GrantedAchievementKey = (typeof GRANTED_ACHIEVEMENT_KEYS)[number]

export const isGrantedAchievementKey = (key: string): key is GrantedAchievementKey =>
  (GRANTED_ACHIEVEMENT_KEYS as readonly string[]).includes(key)

export const grantAchievementSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  key: z.string().trim().min(1)
})

export const achievementRarityStatsSchema = z.object({
  registeredUsers: z.number().int().nonnegative(),
  scannedUsers: z.number().int().nonnegative(),
  failedUsers: z.number().int().nonnegative(),
  computedAt: z.coerce.date(),
  badges: z.record(z.string(), z.object({ holders: z.number().int().nonnegative(), pct: z.number().min(0).max(100) }))
})

export type AchievementRarityInput = z.infer<typeof achievementRarityStatsSchema>

export const PRODUCTS_INDEX = 'products'

const productDocumentSchema = z.object({ id: z.string().min(1) }).loose()

export const ingestProductsSchema = z
  .union([z.array(productDocumentSchema), z.object({ documents: z.array(productDocumentSchema) })])
  .transform((body) => (Array.isArray(body) ? body : body.documents))

export const discoveredProductsSchema = z
  .array(
    z.object({
      id: z.string().min(1),
      url: z.url(),
      collectionSlug: z.string().min(1),
      category: z.enum(CUBE_CATEGORIES)
    })
  )
  .min(1)

export type DiscoveredProduct = z.infer<typeof discoveredProductsSchema>[number]

export const pendingProductsQuerySchema = z.object({
  category: z.enum(CUBE_CATEGORIES),
  limit: z.coerce.number().int().positive().max(5000).default(5000)
})

const scrapeFailureSchema = z.object({ id: z.string().min(1), error: z.string().min(1) })

const scrapeSuccessSchema = z.object({
  id: z.string().min(1),
  name: z.string().nullable().default(null),
  brand: z.array(z.string()).default([]),
  image: z.string().nullable().default(null),
  specs: z.record(z.string(), z.unknown()).default({})
})

export const scrapedProductsSchema = z.array(z.union([scrapeFailureSchema, scrapeSuccessSchema])).min(1)

export type ScrapeResult = z.infer<typeof scrapedProductsSchema>[number]
