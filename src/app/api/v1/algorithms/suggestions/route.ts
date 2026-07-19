import { NextRequest } from 'next/server'
import { suggestionBodySchema } from '@/features/suggest-algorithm/model/api-schemas'
import {
  createSuggestionIssue,
  findAlgorithmSet,
  isRateLimited
} from '@/features/suggest-algorithm/server/suggestion-service'
import { parseJsonBody } from '@/shared/api/parse-json'
import { badRequest, created, serverError } from '@/shared/api/responses'

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (isRateLimited(ip)) {
      return badRequest('Too many suggestions, please try again later')
    }

    const body = await parseJsonBody(request, suggestionBodySchema)
    if (body instanceof Response) return body

    const collection = findAlgorithmSet(body.methodSlug)
    if (!collection) return badRequest('Unknown algorithm set')

    const issue = await createSuggestionIssue(collection, body)

    return created({ url: issue.html_url })
  } catch (error) {
    return serverError('algorithms/suggestions:POST', error)
  }
}
