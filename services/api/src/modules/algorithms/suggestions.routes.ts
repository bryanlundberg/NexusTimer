import { algorithmSuggestionSchema, type AlgorithmSuggestionResponse } from '@nexustimer/contracts'
import { Hono } from 'hono'
import { badRequest, created, serverError } from '../../http/responses'
import type { AppEnv } from '../../http/types'
import { parseJson } from '../../http/validation'
import type { SuggestionsService } from './suggestions.service'

export function suggestionsRoutes(suggestions: SuggestionsService) {
  return new Hono<AppEnv>().post('/', async (c) => {
    try {
      if (!(await suggestions.allow(c.var.clientIp ?? 'unknown'))) {
        return badRequest('Too many suggestions, please try again later')
      }

      const body = await parseJson(c.req.raw, algorithmSuggestionSchema)
      if (body instanceof Response) return body

      const result = await suggestions.suggest(body)
      return 'url' in result ? created<AlgorithmSuggestionResponse>(result) : badRequest('Unknown algorithm set')
    } catch (error) {
      return serverError('algorithms/suggestions:POST', error)
    }
  })
}
