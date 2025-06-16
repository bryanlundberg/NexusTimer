import { Settings } from "@/interfaces/Settings";

export const defaultSettings: Settings = {
  timer: {
    inspection: { status: false, key: "inspection" },
    startCue: { status: false, key: "start-cue" },
    holdToStart: { status: false, key: "hold-to-start" },
    manualMode: { status: false, key: "manual-mode" },
  },
  features: {
    scrambleImage: { status: true, key: "scramble-image" },
    sessionStats: { status: true, key: "session-stats" },
    quickActionButtons: { status: true, key: "quick-action-buttons" },
    hideWhileSolving: { status: false, key: "hide-while-solving" },
    scrambleBackground: { status: false, key: "scramble-background" },
  },
  alerts: {
    bestTime: { status: true, key: "best-time" },
    bestAverage: { status: true, key: "best-average" },
    worstTime: { status: false, key: "worst-time" },
  },
  preferences: {
    defaultCube: { id: null, key: "default-cube" },
    colorTheme: { value: "blue", key: "color-theme" },
  },
  sounds: {
    newPersonalBest: { status: false, key: "new-personal-best" },
  },
};
