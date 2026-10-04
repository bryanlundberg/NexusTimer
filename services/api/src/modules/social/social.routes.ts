import {
  type BlocksResponse,
  type FriendsResponse,
  isObjectId,
  type RelationshipChangeResponse,
  type RelationshipResponse,
  userTargetSchema
} from '@nexustimer/contracts'
import { Hono, type MiddlewareHandler } from 'hono'
import type { UserEnv } from '../../http/require-user'
import { badRequest, forbidden, notFound, ok, serverError, tooManyRequests } from '../../http/responses'
import type { AppEnv } from '../../http/types'
import { parseJson } from '../../http/validation'
import type { BlocksService } from './blocks.service'
import type { FriendRequestResult, FriendsService } from './friends.service'

function invalidTarget(userId: string, otherId: string): Response | null {
  if (!isObjectId(otherId)) return badRequest('Invalid user id')
  if (otherId === userId) return badRequest('Cannot target yourself')
  return null
}

function requestResponse(result: FriendRequestResult) {
  if ('status' in result) return ok<RelationshipChangeResponse>(result)
  switch (result.error) {
    case 'not-found':
      return notFound('User not found')
    case 'blocked':
    case 'requests-closed':
      return forbidden(result.error)
    case 'request-cooldown':
    case 'request-limit':
      return tooManyRequests(result.error)
  }
}

export function friendsRoutes(friends: FriendsService, signedIn: MiddlewareHandler<UserEnv>) {
  return new Hono<AppEnv>()
    .get('/', signedIn, async (c) => {
      try {
        return ok<FriendsResponse>(await friends.list(c.var.userId))
      } catch (error) {
        return serverError('friends:GET', error)
      }
    })
    .post('/', signedIn, async (c) => {
      const body = await parseJson(c.req.raw, userTargetSchema)
      if (body instanceof Response) return body
      if (body.userId === c.var.userId) return badRequest('Cannot add yourself')

      try {
        return requestResponse(await friends.request(c.var.userId, body.userId))
      } catch (error) {
        return serverError('friends:POST', error)
      }
    })
    .get('/:userId', signedIn, async (c) => {
      const otherId = c.req.param('userId')
      const invalid = invalidTarget(c.var.userId, otherId)
      if (invalid) return invalid

      try {
        return ok<RelationshipResponse>(await friends.relationship(c.var.userId, otherId))
      } catch (error) {
        return serverError('friends/[userId]:GET', error)
      }
    })
    .delete('/:userId', signedIn, async (c) => {
      const otherId = c.req.param('userId')
      const invalid = invalidTarget(c.var.userId, otherId)
      if (invalid) return invalid

      try {
        await friends.remove(c.var.userId, otherId)
        return ok<RelationshipChangeResponse>({ status: 'none' })
      } catch (error) {
        return serverError('friends/[userId]:DELETE', error)
      }
    })
}

export function blocksRoutes(blocks: BlocksService, signedIn: MiddlewareHandler<UserEnv>) {
  return new Hono<AppEnv>()
    .get('/', signedIn, async (c) => {
      try {
        return ok<BlocksResponse>(await blocks.list(c.var.userId))
      } catch (error) {
        return serverError('blocks:GET', error)
      }
    })
    .post('/', signedIn, async (c) => {
      const body = await parseJson(c.req.raw, userTargetSchema)
      if (body instanceof Response) return body
      if (body.userId === c.var.userId) return badRequest('Cannot block yourself')

      try {
        const result = await blocks.block(c.var.userId, body.userId)
        return result === 'not-found' ? notFound('User not found') : ok<RelationshipChangeResponse>({ status: result })
      } catch (error) {
        return serverError('blocks:POST', error)
      }
    })
    .delete('/:userId', signedIn, async (c) => {
      const otherId = c.req.param('userId')
      const invalid = invalidTarget(c.var.userId, otherId)
      if (invalid) return invalid

      try {
        await blocks.unblock(c.var.userId, otherId)
        return ok<RelationshipChangeResponse>({ status: 'none' })
      } catch (error) {
        return serverError('blocks/[userId]:DELETE', error)
      }
    })
}
