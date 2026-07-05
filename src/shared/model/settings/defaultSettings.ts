import { Settings } from '@/shared/types/Settings'

export const defaultSettings: Settings = {
  timer: {
    inspection: false,
    inspectionTime: 15000,
    startCue: false,
    holdToStart: false,
    holdToStartTime: 300,
    decimals: 2,
    activationKey: 'Space'
  },
  features: {
    scrambleImage: true,
    sessionStats: true,
    quickActionButtons: true,
    hideWhileSolving: false,
    scrambleBackground: false,
    scrambleSize: 'normal',
    haptics: true
  },
  alerts: {
    bestTime: true,
    bestAverage: true,
    worstTime: false
  },
  preferences: {
    defaultCube: '',
    colorTheme: 'violet'
  },
  sounds: {
    newPersonalBest: true,
    inspection: true,
    newRound: true,
    favorite: true,
    trash: true,
    voiceGender: 'male'
  },
  sync: {
    lastSync: Date.now(),
    totalSolves: 0
  }
}
