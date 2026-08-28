import { useMemo } from 'react'
import { tryAnalyzeSolution } from '@/shared/lib/tryAnalyzeSolution'
import type { SolveAnalysis } from 'cube-state-engine'
import type { SolveServer } from '@/entities/solve/model/types'

const analysisCache = new Map<string, SolveAnalysis | null>()

export function useSolveAnalysis(solve: SolveServer | undefined): SolveAnalysis | null {
  return useMemo(() => {
    const moves = solve?.replay?.moves
    if (!solve || !moves?.length) return null

    const cached = analysisCache.get(solve._id)
    if (cached !== undefined) return cached

    const analysis = tryAnalyzeSolution(moves)
    analysisCache.set(solve._id, analysis)
    return analysis
  }, [solve])
}
