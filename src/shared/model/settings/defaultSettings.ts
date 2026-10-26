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
    timerFont: 'default',
    timerSize: 150,
    haptics: true
  },
  alerts: {
    bestTime: true,
    bestAverage: true,
    worstTime: false,
    solveDelta: true
  },
  preferences: {
    colorTheme: 'indigo',
    vivid: true
  },
  sounds: {
    newPersonalBest: true,
    inspection: true,
    newRound: true,
    messageReceived: true,
    messageSent: true,
    newFriend: true,
    voiceGender: 'male'
  },
  sync: {
    totalSolves: 0
  }
}
