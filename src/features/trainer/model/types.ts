import type { TrainerPenalty } from '@/entities/trainer-solve/model/constants'

export type TrainerRotationMode = 'sequential' | 'shuffle' | 'random'

export interface TrainerCaseStats {
  caseId: string
  totalSolves: number
  best: number | null
  last: number | null
  ao5: number | null
  ao12: number | null
  recentTimes: number[]
}

export interface TrainerSolveListItem {
  _id: string
  methodSlug: string
  caseId: string
  timeMs: number
  penalty: TrainerPenalty
  createdAt: string
}
