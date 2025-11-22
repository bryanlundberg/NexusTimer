import { Colors } from '@/interfaces/types/colors'

type Timer = {
  inspection: boolean
  startCue: boolean
  holdToStart: boolean
  inspectionTime: number
  holdToStartTime: number
  decimals: number
}

type Features = {
  scrambleImage: boolean
  sessionStats: boolean
  quickActionButtons: boolean
  hideWhileSolving: boolean
  scrambleBackground: boolean
}

type Alerts = {
  bestTime: boolean
  bestAverage: boolean
  worstTime: boolean
}

type Preferences = {
  defaultCube: string
  colorTheme: Colors
}

type Sounds = {
  newPersonalBest: boolean
}

type Sync = {
  autoSaveEnabled: boolean
  autoLoadEnabled: boolean
  backupInterval: number
  lastSync: number
  totalSolves: number
}

export type Settings = {
  timer: Timer
  features: Features
  alerts: Alerts
  preferences: Preferences
  sounds: Sounds
  sync: Sync
}
