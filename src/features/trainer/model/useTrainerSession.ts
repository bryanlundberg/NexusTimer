'use client'

import { useMemo, useRef } from 'react'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'
import { useTrainerStore } from '@/features/trainer/model/useTrainerStore'
import { invertAlgorithm } from '@/features/trainer/lib/trainerUtils'
import type { Alg } from '@/features/algorithms-list/model/types'

type AlgPick = { caseId: string; alg: Alg }

export const useTrainerSession = () => {
  const methodSlug = useTrainerStore((s) => s.methodSlug)
  const pickedIds = useTrainerStore((s) => s.pickedIds)
  const caseIndex = useTrainerStore((s) => s.caseIndex)

  const set = useMemo(() => ALGORITHM_SETS.find((s) => s.slug === methodSlug) ?? ALGORITHM_SETS[0], [methodSlug])
  const sessionCases = useMemo(() => set.algorithms.filter((a) => pickedIds.has(a.id)), [set, pickedIds])
  const currentCase = sessionCases[caseIndex] ?? sessionCases[0]

  const pickRef = useRef<AlgPick | null>(null)
  if (currentCase && pickRef.current?.caseId !== currentCase.id) {
    pickRef.current = { caseId: currentCase.id, alg: currentCase.algs[0] }
  }

  const currentAlg = currentCase ? pickRef.current?.alg : undefined
  const setup = currentCase ? currentCase.setup?.trim() || invertAlgorithm(currentCase.algs[0].moves) : ''

  return { set, sessionCases, currentCase, currentAlg, setup }
}
