export enum TrainerStatus {
  IDLE = 'IDLE',
  READY = 'READY',
  SOLVING = 'SOLVING'
}

export interface TrainerCaseStats {
  caseId: string
  totalSolves: number
  best: number | null
  last: number | null
  ao5: number | null
  ao12: number | null
  learned: boolean
}
