'use client'

import { useMemo } from 'react'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'
import { useTrainerStore } from '@/features/trainer/model/useTrainerStore'

export const useTrainerSession = () => {
  const methodSlug = useTrainerStore((s) => s.methodSlug)
  const pickedIds = useTrainerStore((s) => s.pickedIds)
  const caseIndex = useTrainerStore((s) => s.caseIndex)

  const set = useMemo(() => ALGORITHM_SETS.find((s) => s.slug === methodSlug) ?? ALGORITHM_SETS[0], [methodSlug])
  const sessionCases = useMemo(() => set.algorithms.filter((a) => pickedIds.has(a.id)), [set, pickedIds])
  const currentCase = sessionCases[caseIndex] ?? sessionCases[0]
  const currentAlg = currentCase?.algs[0]

  return { set, sessionCases, currentCase, currentAlg }
}
