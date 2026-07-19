import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'
import { createGithubIssue } from './github-app'
import type { SuggestionBody } from '../model/api-schemas'

const RATE_LIMIT = 10
const RATE_WINDOW_MS = 60 * 60 * 1000
const requestLog = new Map<string, number[]>()

export function isRateLimited(ip: string) {
  const now = Date.now()
  const timestamps = (requestLog.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS)
  if (timestamps.length >= RATE_LIMIT) return true
  timestamps.push(now)
  requestLog.set(ip, timestamps)
  if (requestLog.size > 10_000) requestLog.clear()
  return false
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
