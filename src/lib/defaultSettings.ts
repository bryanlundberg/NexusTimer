import { Settings } from "@/interfaces/Settings";

export const defaultSettings: Settings = {
  locale: [{ id: 1, status: true, lang: "en", translationKey: "language" }],
  timer: [
    { id: 3, status: true, lang: "en", translationKey: "inspection" },
    { id: 4, status: false, lang: "en", translationKey: "start-cue" },
    { id: 5, status: true, lang: "en", translationKey: "hold-to-start" },
    { id: 6, status: false, lang: "en", translationKey: "manual-mode" },
  ],
  features: [
    { id: 7, status: true, lang: "en", translationKey: "scramble-image" },
    { id: 8, status: true, lang: "en", translationKey: "session-stats" },
    { id: 9, status: true, lang: "en", translationKey: "quick-action-buttons" },
    {
      id: 10,
      status: false,
      lang: "en",
      translationKey: "hide-while-solving",
    },
    { id: 11, status: true, lang: "en", translationKey: "scramble-background" },
  ],
  alerts: [
    { id: 12, status: false, lang: "en", translationKey: "best-time" },
    { id: 13, status: false, lang: "en", translationKey: "best-average" },
    { id: 14, status: false, lang: "en", translationKey: "worst-time" },
  ],
};
