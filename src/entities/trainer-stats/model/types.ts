import type { TrainerMethodStatsDoc } from '@nexustimer/contracts'

export type { TrainerCaseStatsDoc, TrainerMethodStatsDoc } from '@nexustimer/contracts'

export interface TrainerStatsDocument {
  _id: string
  user: string
  methods: Record<string, TrainerMethodStatsDoc>
  createdAt: Date
  updatedAt: Date
}
