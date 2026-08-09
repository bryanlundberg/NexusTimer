export const VERSUS_CATEGORIES = ['2x2', '3x3', '4x4', 'SQ1', 'Pyraminx', 'Skewb'] as const

export type VersusCategory = (typeof VERSUS_CATEGORIES)[number]

export const VERSUS_PLAYER_COUNTS = [2, 3, 4] as const

export type VersusPlayerCount = (typeof VERSUS_PLAYER_COUNTS)[number]

export enum LaneStatus {
  IDLE = 'IDLE',
  HOLDING = 'HOLDING',
  READY = 'READY',
  RUNNING = 'RUNNING',
  DONE = 'DONE'
}

export type VersusPlayer = {
  id: number
  name: string
  color: string
  status: LaneStatus
  timeMs: number | null
  history: number[]
}
