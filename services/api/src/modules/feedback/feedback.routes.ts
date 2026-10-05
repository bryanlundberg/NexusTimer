import { type FeedbackResponse, feedbackSchema } from '@nexustimer/contracts'
import { Hono, type MiddlewareHandler } from 'hono'
import type { UserEnv } from '../../http/require-user'
import { created, serverError } from '../../http/responses'
import type { AppEnv } from '../../http/types'
import { parseJson } from '../../http/validation'
import type { FeedbackService } from './feedback.service'

export function feedbackRoutes(feedback: FeedbackService, signedIn: MiddlewareHandler<UserEnv>) {
  return new Hono<AppEnv>().post('/', signedIn, async (c) => {
    const body = await parseJson(c.req.raw, feedbackSchema)
    if (body instanceof Response) return body

    try {
      return created<FeedbackResponse>(await feedback.submit(c.var.userId, body))
    } catch (error) {
      return serverError('feedback:POST', error)
    }
  })
}
