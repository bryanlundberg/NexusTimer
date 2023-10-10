import { Settings } from "@/interfaces/Settings";

export const defaultSettings: Settings = {
  locale: [{ lang: "en", key: "language" }],
  timer: [
    { status: true, key: "inspection" },
    { status: false, key: "start-cue" },
    { status: true, key: "hold-to-start" },
    { status: false, key: "manual-mode" },
  ],
  features: [
    { status: true, key: "scramble-image" },
    { status: true, key: "session-stats" },
    { status: true, key: "quick-action-buttons" },
    { status: false, key: "hide-while-solving" },
    { status: true, key: "scramble-background" },
  ],
  alerts: [
    { status: false, key: "best-time" },
    { status: false, key: "best-average" },
    { status: false, key: "worst-time" },
  ],
  theme: [
    { bg: "dark", key: "background-color" },
    { text: "dark", key: "letter-color" },
  ],
};
