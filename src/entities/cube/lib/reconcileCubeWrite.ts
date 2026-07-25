import { Cube } from '@/entities/cube/model/types'
import { Solve } from '@/entities/solve/model/types'

/**
 * Merges an incoming cube write with the record already stored in IndexedDB.
 *
 * `getAll`/`getById` strip soft-deleted solves, but `update` persists the whole
 * cube.
 *
 * Rule: solves present in the write win, solves missing from it are preserved
 * exactly as stored. No caller removes a live solve from the arrays -- deletes
 * are soft and moves keep the id, changing only the bucket -- so anything
 * missing was stripped on read. Preserving verbatim is therefore non-destructive
 * in every case, including the unexpected ones.
 */
export function reconcileCubeWrite(stored: Cube | undefined | null, incoming: Cube): Cube {
  if (!stored?.solves || !incoming?.solves) return incoming

  const session = incoming.solves.session ?? []
  const all = incoming.solves.all ?? []

  // Ids are unique per cube, not per bucket: a solve moved from `session` to
  // `all` must not be preserved back into `session`.
  const seen = new Set<string>()
  for (const solve of session) seen.add(solve.id)
  for (const solve of all) seen.add(solve.id)

  const preserved = (list: Solve[] = []): Solve[] => {
    const kept: Solve[] = []
    for (const solve of list) {
      if (seen.has(solve.id)) continue
      seen.add(solve.id)
      kept.push(solve)
    }
    return kept
  }

  return {
    ...incoming,
    solves: {
      session: [...session, ...preserved(stored.solves.session)],
      all: [...all, ...preserved(stored.solves.all)]
    }
  }
}
