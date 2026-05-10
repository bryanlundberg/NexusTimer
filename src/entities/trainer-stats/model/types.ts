export interface TrainerCaseStatsDoc {
  totalSolves: number
  totalTimeMs: number
  bestSingleMs: number | null
  lastSolveMs: number | null
  lastSolveAt: number | null
  recentTimes: number[]
}

export interface TrainerMethodStatsDoc {
  totalSolves: number
  totalTimeMs: number
  bestSingleMs: number | null
  cases: Record<string, TrainerCaseStatsDoc>
}

export interface TrainerStatsDocument {
  _id: string
  user: string
  methods: Record<string, TrainerMethodStatsDoc>
  createdAt: Date
  updatedAt: Date
}
