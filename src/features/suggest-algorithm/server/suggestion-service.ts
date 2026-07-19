import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'
import getRedis from '@/shared/config/redis/redis'
import { createGithubIssue } from './github-app'
import type { SuggestionBody } from '../model/api-schemas'

const RATE_LIMIT = 5
const RATE_WINDOW_SECONDS = 60 * 60

export async function isRateLimited(ip: string) {
  try {
    const redis = await getRedis()
    const key = `rate-limit:algorithm-suggestions:${ip}`
    const count = await redis.incr(key)
    if (count === 1) {
      await redis.expire(key, RATE_WINDOW_SECONDS)
    }
    return count > RATE_LIMIT
  } catch (error) {
    console.error('[algorithms/suggestions:rate-limit]', error)
    return false
  }
}

export function findAlgorithmSet(slug: string) {
  return ALGORITHM_SETS.find((set) => set.slug === slug)
}

export async function createSuggestionIssue(
  collection: NonNullable<ReturnType<typeof findAlgorithmSet>>,
  body: SuggestionBody
) {
  return createGithubIssue({
    title: `[Algorithm suggestion] ${collection.title} - ${body.caseName}`,
    body: [
      '> Suggestion submitted from the website.',
      '',
      `**Set:** ${collection.title} (\`${collection.slug}\`)`,
      `**Puzzle:** ${collection.puzzle}`,
      `**Case:** ${body.caseName}`,
      '',
      '**Suggested algorithm:**',
      '```',
      body.algorithm,
      '```',
      ...(body.comment ? ['', '**Comment:**', body.comment] : []),
      '',
      `**File:** \`src/shared/data/algs/${collection.file?.toLowerCase() ?? ''}\``
    ].join('\n')
  })
}
