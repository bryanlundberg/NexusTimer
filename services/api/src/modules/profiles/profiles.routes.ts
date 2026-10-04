import type {
  PublicProfile,
  SharedSolvesPage,
  UserLearnedResponse,
  UserProfileResponse,
  UsersListResponse,
  UserStatsResponse
} from '@nexustimer/contracts'
import { Hono, type MiddlewareHandler } from 'hono'
import type { UserEnv, ViewerEnv } from '../../http/require-user'
import { notFound, ok, serverError, unauthorized } from '../../http/responses'
import type { AppEnv } from '../../http/types'
import { parseJson } from '../../http/validation'
import { updateProfileBodySchema } from './profiles.schemas'
import type { ProfilesService } from './profiles.service'

export function profilesRoutes(
  profiles: ProfilesService,
  signedIn: MiddlewareHandler<UserEnv>,
  viewer: MiddlewareHandler<ViewerEnv>
) {
  return new Hono<AppEnv>()
    .get('/', viewer, async (c) => {
      try {
        const query = {
          page: Math.max(1, Number(c.req.query('page')) || 1),
          name: (c.req.query('name') || '').trim(),
          country: (c.req.query('country') || '').trim().toUpperCase()
        }
        return ok<UsersListResponse>(await profiles.list(query, c.var.viewerId))
      } catch (error) {
        return serverError('users:GET', error)
      }
    })
    .get('/:id', viewer, async (c) => {
      try {
        const profile = await profiles.profile(c.req.param('id'), c.var.viewerId)
        return profile ? ok<UserProfileResponse>(profile) : notFound('User not found')
      } catch (error) {
        return serverError('users/[id]:GET', error)
      }
    })
    .patch('/:id', signedIn, async (c) => {
      const id = c.req.param('id')
      if (c.var.userId !== id) return unauthorized()

      const body = await parseJson(c.req.raw, updateProfileBodySchema)
      if (body instanceof Response) return body

      try {
        return ok<PublicProfile | null>(await profiles.update(id, body))
      } catch (error) {
        return serverError('users/[id]:PATCH', error)
      }
    })
    .get('/:id/learned', viewer, async (c) => {
      try {
        return ok<UserLearnedResponse>(await profiles.learned(c.req.param('id'), c.var.viewerId))
      } catch (error) {
        return serverError('users/[id]/learned:GET', error)
      }
    })
    .get('/:id/stats', viewer, async (c) => {
      try {
        return ok<UserStatsResponse>(await profiles.stats(c.req.param('id'), c.var.viewerId))
      } catch (error) {
        return serverError('users/[id]/stats:GET', error)
      }
    })
    .get('/:id/shared-solves', viewer, async (c) => {
      try {
        const page = await profiles.sharedSolves(c.req.param('id'), c.var.viewerId, c.req.query('cursor') ?? null)
        return ok<SharedSolvesPage>(page)
      } catch (error) {
        return serverError('users/[id]/shared-solves:GET', error)
      }
    })
}
