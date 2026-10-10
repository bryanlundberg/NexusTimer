import { timingSafeEqual } from 'node:crypto'
import { type InternalScramblesResponse, internalScramblesSchema } from '@nexustimer/contracts'
import { Hono } from 'hono'
import { ok, serverError, serviceUnavailable, unauthorized } from '../../http/responses'
import type { AppEnv } from '../../http/types'
import { parseJson } from '../../http/validation'
import type { ScrambleGenerator } from './scrambles.service'

function bearerMatches(header: string | undefined, secret: string) {
  const provided = Buffer.from(header ?? '')
  const expected = Buffer.from(`Bearer ${secret}`)
  return provided.length === expected.length && timingSafeEqual(provided, expected)
}

export function scramblesRoutes(secret: string | undefined, generate: ScrambleGenerator) {
  return new Hono<AppEnv>().post('/scrambles', async (c) => {
    if (!secret) return serviceUnavailable('Realtime is not configured')
    if (!bearerMatches(c.req.header('authorization'), secret)) return unauthorized()

    const body = await parseJson(c.req.raw, internalScramblesSchema)
    if (body instanceof Response) return body

    try {
      return ok<InternalScramblesResponse>({ scrambles: await generate(body.event, body.count) })
    } catch (error) {
      return serverError('internal/scrambles:POST', error)
    }
  })
}
