import { Settings } from "@/interfaces/Settings";

export const defaultSettings: Settings = {
  timer: {
    inspection: false,
    inspectionTime: 15000,
    startCue: false,
    holdToStart: false,
    holdToStartTime: 300,
    decimals: 2,
  },
  features: {
    scrambleImage: true,
    sessionStats: true,
    quickActionButtons: true,
    hideWhileSolving: false,
    scrambleBackground: false
  },
  alerts: {
    bestTime: true,
    bestAverage: true,
    worstTime: false
  },
  preferences: {
    defaultCube: "",
    colorTheme: "neutral"
  },
  sounds: {
    newPersonalBest: true,
  },
  sync: {
    autoSaveEnabled: true,
    autoLoadEnabled: true,
    backupInterval: 25,
    lastSync: Date.now(),
    totalSolves: 0,
  }
};
