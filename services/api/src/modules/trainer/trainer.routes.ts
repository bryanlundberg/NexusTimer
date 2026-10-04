import {
  type OkResponse,
  type TrainerAllStatsResponse,
  type TrainerLearnedResponse,
  type TrainerLearnedUpdateResponse,
  type TrainerMethodStatsResponse,
  type TrainerSolveCreatedResponse,
  type TrainerSolvesResponse,
  trainerLearnedQuerySchema,
  trainerSolvesQuerySchema
} from '@nexustimer/contracts'
import { Hono, type MiddlewareHandler } from 'hono'
import type { UserEnv } from '../../http/require-user'
import { created, notFound, ok, serverError } from '../../http/responses'
import type { AppEnv } from '../../http/types'
import { parseJson, parseQuery } from '../../http/validation'
import { learnedBodySchema, solveBodySchema, targetBodySchema } from './trainer.schemas'
import type { TrainerService } from './trainer.service'

export function trainerRoutes(trainer: TrainerService, signedIn: MiddlewareHandler<UserEnv>) {
  return new Hono<AppEnv>()
    .get('/learned', signedIn, async (c) => {
      const query = parseQuery(c.req.url, trainerLearnedQuerySchema)
      if (query instanceof Response) return query

      try {
        return ok<TrainerLearnedResponse>({ caseIds: await trainer.learned(c.var.userId, query.methodSlug) })
      } catch (error) {
        return serverError('trainer/learned:GET', error)
      }
    })
    .post('/learned', signedIn, async (c) => {
      const body = await parseJson(c.req.raw, learnedBodySchema)
      if (body instanceof Response) return body

      try {
        await trainer.setLearned(c.var.userId, body)
        return ok<TrainerLearnedUpdateResponse>({ ok: true, learned: body.learned })
      } catch (error) {
        return serverError('trainer/learned:POST', error)
      }
    })
    .get('/solves', signedIn, async (c) => {
      const query = parseQuery(c.req.url, trainerSolvesQuerySchema)
      if (query instanceof Response) return query

      try {
        return ok<TrainerSolvesResponse>({ solves: await trainer.solves(c.var.userId, query) })
      } catch (error) {
        return serverError('trainer/solves:GET', error)
      }
    })
    .post('/solves', signedIn, async (c) => {
      const body = await parseJson(c.req.raw, solveBodySchema)
      if (body instanceof Response) return body

      try {
        return created<TrainerSolveCreatedResponse>({ solve: await trainer.recordSolve(c.var.userId, body) })
      } catch (error) {
        return serverError('trainer/solves:POST', error)
      }
    })
    .delete('/solves/:id', signedIn, async (c) => {
      try {
        const deleted = await trainer.deleteSolve(c.var.userId, c.req.param('id'))
        return deleted ? ok<OkResponse>({ ok: true }) : notFound()
      } catch (error) {
        return serverError('trainer/solves/[id]:DELETE', error)
      }
    })
    .get('/stats', signedIn, async (c) => {
      try {
        const methods = await trainer.stats(c.var.userId)
        const method = c.req.query('method')
        if (method) return ok<TrainerMethodStatsResponse>({ method, stats: methods[method] ?? null })
        return ok<TrainerAllStatsResponse>({ methods })
      } catch (error) {
        return serverError('trainer/stats:GET', error)
      }
    })
    .patch('/stats', signedIn, async (c) => {
      const body = await parseJson(c.req.raw, targetBodySchema)
      if (body instanceof Response) return body

      try {
        await trainer.setTarget(c.var.userId, body)
        return ok<OkResponse>({ ok: true })
      } catch (error) {
        return serverError('trainer/stats:PATCH', error)
      }
    })
}
