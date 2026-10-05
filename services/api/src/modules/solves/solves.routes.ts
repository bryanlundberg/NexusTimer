import { submitSolveSchema } from '@nexustimer/contracts'
import { Hono, type MiddlewareHandler } from 'hono'
import type { UserEnv } from '../../http/require-user'
import { noContent, serverError } from '../../http/responses'
import type { AppEnv } from '../../http/types'
import { parseJson } from '../../http/validation'
import type { SolvesService } from './solves.service'

export function solvesRoutes(solves: SolvesService, signedIn: MiddlewareHandler<UserEnv>) {
  return new Hono<AppEnv>().post('/', signedIn, async (c) => {
    const body = await parseJson(c.req.raw, submitSolveSchema)
    if (body instanceof Response) return body

    try {
      await solves.submit(c.var.userId, body)
      return noContent()
    } catch (error) {
      return serverError('solves:POST', error)
    }
  })
}
