import { Settings } from "@/interfaces/Settings";

export const defaultSettings: Settings = {
  timer: {
    inspection: false,
    startCue: false,
    holdToStart: false,
    manualMode: false
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
  }
};
