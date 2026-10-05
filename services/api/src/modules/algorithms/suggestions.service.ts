import { ALGORITHM_SET_DEFINITIONS } from '@nexustimer/algorithms'
import type { AlgorithmSuggestionInput } from '@nexustimer/contracts'
import type { Github } from '../../infra/github'
import type { SuggestionLimits } from './suggestions.limits'

export type SuggestionResult = { url: string } | { error: 'unknown-set' }

export type SuggestionsService = {
  allow(ip: string): Promise<boolean>
  suggest(input: AlgorithmSuggestionInput): Promise<SuggestionResult>
}

type SuggestionsDeps = { github: Pick<Github, 'createIssue'>; limits: SuggestionLimits }

export function createSuggestionsService({ github, limits }: SuggestionsDeps): SuggestionsService {
  return {
    allow: (ip) => limits.consume(ip),

    async suggest(input) {
      const set = ALGORITHM_SET_DEFINITIONS.find((definition) => definition.slug === input.methodSlug)
      if (!set) return { error: 'unknown-set' }

      const issue = await github.createIssue({
        title: `[Algorithm suggestion] ${set.title} - ${input.caseName}`,
        body: [
          '> Suggestion submitted from the website.',
          '',
          `**Set:** ${set.title} (\`${set.slug}\`)`,
          `**Puzzle:** ${set.puzzle}`,
          `**Case:** ${input.caseName}`,
          '',
          '**Suggested algorithm:**',
          '```',
          input.algorithm,
          '```',
          ...(input.comment ? ['', '**Comment:**', input.comment] : []),
          '',
          `**File:** \`packages/algorithms/src/data/${set.file?.toLowerCase() ?? ''}\``
        ].join('\n')
      })
      return { url: issue.html_url }
    }
  }
}
