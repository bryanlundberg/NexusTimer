import { Colors } from '@/shared/types/colors'

type Timer = {
  inspection: boolean
  startCue: boolean
  holdToStart: boolean
  inspectionTime: number
  holdToStartTime: number
  decimals: number
  activationKey: string
}

type Features = {
  scrambleImage: boolean
  sessionStats: boolean
  quickActionButtons: boolean
  hideWhileSolving: boolean
  scrambleBackground: boolean
  scrambleSize: 'normal' | 'large'
  haptics: boolean
  focusModeScramble: boolean
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
  voiceGender: 'male' | 'female'
}

type Sync = {
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
