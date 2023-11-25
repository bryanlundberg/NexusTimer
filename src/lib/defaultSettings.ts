import { Settings } from "@/interfaces/Settings";

export const defaultSettings: Settings = {
  locale: {
    language: { lang: "en", key: "language" },
  },
  timer: {
    inspection: { status: true, key: "inspection" },
    startCue: { status: true, key: "start-cue" },
    holdToStart: { status: false, key: "hold-to-start" },
    manualMode: { status: false, key: "manual-mode" },
  },
  features: {
    scrambleImage: { status: true, key: "scramble-image" },
    sessionStats: { status: true, key: "session-stats" },
    quickActionButtons: { status: false, key: "quick-action-buttons" },
    hideWhileSolving: { status: false, key: "hide-while-solving" },
    scrambleBackground: { status: false, key: "scramble-background" },
  },
  alerts: {
    bestTime: { status: true, key: "best-time" },
    bestAverage: { status: true, key: "best-average" },
    worstTime: { status: false, key: "worst-time" },
  },
  theme: {
    background: { color: "dark", key: "background-color" },
    content: { color: "dark", key: "letter-color" },
  },
};
