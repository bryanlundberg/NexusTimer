import { Settings } from "@/interfaces/Settings";

export const defaultSettings: Settings = {
  locale: [{ id: 1, lang: "en", translationKey: "language" }],
  timer: [
    { id: 2, status: true, translationKey: "inspection" },
    { id: 3, status: false, translationKey: "start-cue" },
    { id: 4, status: true, translationKey: "hold-to-start" },
    { id: 5, status: false, translationKey: "manual-mode" },
  ],
  features: [
    { id: 6, status: true, translationKey: "scramble-image" },
    { id: 7, status: true, translationKey: "session-stats" },
    { id: 8, status: true, translationKey: "quick-action-buttons" },
    { id: 9, status: false, translationKey: "hide-while-solving" },
    { id: 10, status: true, translationKey: "scramble-background" },
  ],
  alerts: [
    { id: 11, status: false, translationKey: "best-time" },
    { id: 12, status: false, translationKey: "best-average" },
    { id: 13, status: false, translationKey: "worst-time" },
  ],
  theme: [
    { id: 14, bg: "light", translationKey: "background-color" },
    { id: 15, text: "dark", translationKey: "letter-color" },
  ],
};
