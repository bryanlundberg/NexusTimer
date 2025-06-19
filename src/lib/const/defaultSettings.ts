import { Settings } from "@/interfaces/Settings";

export const defaultSettings: Settings = {
  timer: {
    inspection: false,
    inspectionTime: 15000,
    startCue: false,
    holdToStart: false,
    holdToStartTime: 300,
    manualMode: false,
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
    colorTheme: "blue"
  },
  sounds: {
    newPersonalBest: true,
  },
};
