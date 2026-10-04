import {
  achievementRarityStatsSchema,
  discoveredProductsSchema,
  GRANTED_ACHIEVEMENT_KEYS,
  grantAchievementSchema,
  ingestProductsSchema,
  isGrantedAchievementKey,
  pendingProductsQuerySchema,
  PRODUCTS_INDEX,
  scrapedProductsSchema
} from '@nexustimer/contracts'
import { Hono, type MiddlewareHandler } from 'hono'
import { badRequest, notFound, ok, serverError } from '../../http/responses'
import type { AppEnv } from '../../http/types'
import { parseJson, parseQuery } from '../../http/validation'
import { logger } from '../../lib/logger'
import type { ProductsService } from '../products/products.service'
import type { AdminService } from './admin.service'

const USER_NOT_FOUND = 'User not found'

const emailParam = (value: string | undefined) => value?.trim().toLowerCase() || null

export function adminRoutes(
  { admin, products }: { admin: AdminService; products: ProductsService },
  adminOnly: MiddlewareHandler<AppEnv>
) {
  return new Hono<AppEnv>()
    .use(adminOnly)
    .get('/achievements', async (c) => {
      try {
        const email = emailParam(c.req.query('email'))
        if (!email) return badRequest('email query param is required')
        const result = await admin.achievements(email)
        return result ? ok(result) : notFound(USER_NOT_FOUND)
      } catch (error) {
        return serverError('admin/achievements:GET', error)
      }
    })
    .post('/achievements', async (c) => {
      try {
        const body = await parseJson(c.req.raw, grantAchievementSchema)
        if (body instanceof Response) return body
        if (!isGrantedAchievementKey(body.key)) {
          return badRequest(`Invalid key. Allowed: ${GRANTED_ACHIEVEMENT_KEYS.join(', ')}`)
        }
        const result = await admin.grant(body.email, body.key)
        return result ? ok(result) : notFound(USER_NOT_FOUND)
      } catch (error) {
        return serverError('admin/achievements:POST', error)
      }
    })
    .delete('/achievements', async (c) => {
      try {
        const email = emailParam(c.req.query('email'))
        const key = c.req.query('key')?.trim() || null
        if (!email || !key) return badRequest('email and key query params are required')
        const result = await admin.revoke(email, key)
        return result ? ok(result) : notFound(USER_NOT_FOUND)
      } catch (error) {
        return serverError('admin/achievements:DELETE', error)
      }
    })
    .post('/rarity', async (c) => {
      try {
        const stats = await parseJson(c.req.raw, achievementRarityStatsSchema)
        if (stats instanceof Response) return stats
        return ok(await admin.saveRarity(stats))
      } catch (error) {
        return serverError('admin/rarity:POST', error)
      }
    })
    .get('/users', async (c) => {
      try {
        const email = emailParam(c.req.query('email'))
        if (!email) return badRequest('email query param is required')
        const result = await admin.userSummary(email)
        return result ? ok(result) : notFound(USER_NOT_FOUND)
      } catch (error) {
        return serverError('admin/users:GET', error)
      }
    })
    .delete('/users', async (c) => {
      try {
        const email = emailParam(c.req.query('email'))
        if (!email) return badRequest('email query param is required')
        const result = await admin.deleteUser(email)
        return result ? ok(result) : notFound(USER_NOT_FOUND)
      } catch (error) {
        return serverError('admin/users:DELETE', error)
      }
    })
    .post('/ingestion/products', async (c) => {
      try {
        const documents = await parseJson(c.req.raw, ingestProductsSchema)
        if (documents instanceof Response) return documents
        if (documents.length === 0) return badRequest('No documents to index')

        const { ok: succeeded, task } = await products.index(documents)
        if (!succeeded) return Response.json({ message: 'Ingestion task failed', task }, { status: 500 })
        return ok({ indexed: documents.length, task })
      } catch (error) {
        return serverError('admin/ingestion/products:POST', error)
      }
    })
    .delete('/ingestion/products', async (c) => {
      try {
        if (c.req.query('index') !== PRODUCTS_INDEX) {
          return badRequest(`Pass ?index=${PRODUCTS_INDEX} to confirm deleting the index`)
        }
        const { ok: succeeded, task } = await products.deleteIndex()
        if (!succeeded) {
          logger.error('delete index task failed', { task })
          return Response.json({ message: 'Delete index task failed', task }, { status: 500 })
        }
        return ok({ deletedIndex: PRODUCTS_INDEX, task })
      } catch (error) {
        return serverError('admin/ingestion/products:DELETE', error)
      }
    })
    .get('/ingestion/products', async () => {
      try {
        return ok({ stats: await products.stats() })
      } catch (error) {
        return serverError('admin/ingestion/products:GET', error)
      }
    })
    .post('/ingestion/products/discovered', async (c) => {
      try {
        const body = await parseJson(c.req.raw, discoveredProductsSchema)
        if (body instanceof Response) return body
        return ok(await products.discover(body))
      } catch (error) {
        return serverError('admin/ingestion/products/discovered:POST', error)
      }
    })
    .get('/ingestion/products/pending', async (c) => {
      try {
        const query = parseQuery(c.req.url, pendingProductsQuerySchema)
        if (query instanceof Response) return query
        return ok({ products: await products.pending(query.category, query.limit) })
      } catch (error) {
        return serverError('admin/ingestion/products/pending:GET', error)
      }
    })
    .post('/ingestion/products/publish', async () => {
      try {
        const result = await products.publish()
        if ('failed' in result) {
          return Response.json({ message: 'Ingestion task failed', task: result.failed }, { status: 500 })
        }
        return ok(result)
      } catch (error) {
        return serverError('admin/ingestion/products/publish:POST', error)
      }
    })
    .post('/ingestion/products/scraped', async (c) => {
      try {
        const body = await parseJson(c.req.raw, scrapedProductsSchema)
        if (body instanceof Response) return body
        return ok(await products.recordScrapes(body))
      } catch (error) {
        return serverError('admin/ingestion/products/scraped:POST', error)
      }
    })
}
