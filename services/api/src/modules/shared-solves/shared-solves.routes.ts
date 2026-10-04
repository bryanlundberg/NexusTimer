import {
  isValidSlug,
  type MySharedIdsResponse,
  type SharedSolveDetail,
  shareSolveSchema,
  type ShareSolveResponse
} from '@nexustimer/contracts'
import { Hono, type MiddlewareHandler } from 'hono'
import type { UserEnv, ViewerEnv } from '../../http/require-user'
import { created, noContent, notFound, ok, serverError, tooManyRequests } from '../../http/responses'
import type { AppEnv } from '../../http/types'
import { parseJson } from '../../http/validation'
import type { SharedSolvesService } from './shared-solves.service'

export function sharedSolvesRoutes(
  sharedSolves: SharedSolvesService,
  signedIn: MiddlewareHandler<UserEnv>,
  viewer: MiddlewareHandler<ViewerEnv>
) {
  return new Hono<AppEnv>()
    .get('/', signedIn, async (c) => {
      try {
        return ok<MySharedIdsResponse>({ ids: await sharedSolves.myIds(c.var.userId) })
      } catch (error) {
        return serverError('shared-solves:GET', error)
      }
    })
    .post('/', signedIn, async (c) => {
      const body = await parseJson(c.req.raw, shareSolveSchema)
      if (body instanceof Response) return body

      try {
        const result = await sharedSolves.share(c.var.userId, body)
        if (result.status === 'rate-limited') return tooManyRequests()
        const response: ShareSolveResponse = { slug: result.slug }
        return result.status === 'created' ? created(response) : ok(response)
      } catch (error) {
        return serverError('shared-solves:POST', error)
      }
    })
    .get('/:slug', viewer, async (c) => {
      const slug = c.req.param('slug')
      if (!isValidSlug(slug)) return notFound()

      try {
        const detail = await sharedSolves.detail(slug, c.var.viewerId)
        return detail ? ok<SharedSolveDetail>(detail) : notFound()
      } catch (error) {
        return serverError('shared-solves/[slug]:GET', error)
      }
    })
    .delete('/:slug', signedIn, async (c) => {
      const slug = c.req.param('slug')
      if (!isValidSlug(slug)) return notFound()

      try {
        return (await sharedSolves.remove(c.var.userId, slug)) ? noContent() : notFound()
      } catch (error) {
        return serverError('shared-solves/[slug]:DELETE', error)
      }
    })
}
