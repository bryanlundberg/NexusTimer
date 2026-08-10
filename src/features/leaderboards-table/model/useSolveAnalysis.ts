import { useMemo } from 'react'
import { tryAnalyzeSolution } from '@/shared/lib/tryAnalyzeSolution'
import type { ReplayMove } from '@/entities/replay/model/types'
import type { SolveServer } from '@/entities/solve/model/types'

type SolveAnalysis = ReturnType<typeof tryAnalyzeSolution>

const analysisCache = new Map<string, SolveAnalysis>()

export function useSolveAnalysis(solve: SolveServer | undefined): SolveAnalysis {
  return useMemo(() => {
    const moves = solve?.replay?.moves as ReplayMove[] | undefined
    if (!solve || !moves?.length) return null

    const cached = analysisCache.get(solve._id)
    if (cached !== undefined) return cached

    const analysis = tryAnalyzeSolution(moves)
    analysisCache.set(solve._id, analysis)
    return analysis
  }, [solve])
}
