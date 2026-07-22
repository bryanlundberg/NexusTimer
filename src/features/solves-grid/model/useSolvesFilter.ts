import { useQueryState } from 'nuqs'
import { useCallback, useMemo } from 'react'
import { STATES } from '@/shared/const/states'
import { Solve } from '@/entities/solve/model/types'

export type PenaltyFilter = 'ok' | 'plus2' | 'dnf'

const ALL: PenaltyFilter[] = ['ok', 'plus2', 'dnf']

export function getSolveCategory(solve: Solve): PenaltyFilter {
  if (solve.dnf) return 'dnf'
  if (solve.plus2) return 'plus2'
  return 'ok'
}

export function useSolvesFilter() {
  const [raw, setRaw] = useQueryState(STATES.SOLVES_PAGE.FILTER.KEY, {
    defaultValue: STATES.SOLVES_PAGE.FILTER.DEFAULT_VALUE
  })

  const disabled = useMemo(() => new Set((raw || '').split(',').filter(Boolean) as PenaltyFilter[]), [raw])

  const enabled = useMemo(
    () => ({
      ok: !disabled.has('ok'),
      plus2: !disabled.has('plus2'),
      dnf: !disabled.has('dnf')
    }),
    [disabled]
  )

  const hasActiveFilter = disabled.size > 0

  const isVisible = useCallback((solve: Solve) => !disabled.has(getSolveCategory(solve)), [disabled])

  const toggle = useCallback(
    (category: PenaltyFilter) => {
      const next = new Set(disabled)
      if (next.has(category)) next.delete(category)
      else next.add(category)
      const value = ALL.filter((c) => next.has(c)).join(',')
      // null resets the param back to its default value (all active)
      setRaw(value || null)
    },
    [disabled, setRaw]
  )

  return { enabled, hasActiveFilter, isVisible, toggle }
}
