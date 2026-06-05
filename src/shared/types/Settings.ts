import { Colors } from '@/shared/types/colors'

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
  scrambleSize: 'normal' | 'large'
  haptics: boolean
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
  inspection: boolean
  newRound: boolean
  favorite: boolean
  trash: boolean
  voiceGender: 'male' | 'female'
}

type Sync = {
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
