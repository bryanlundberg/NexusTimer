import { Settings } from "@/interfaces/Settings";

export const defaultSettings: Settings = {
  locale: [{ id: 1, status: true, lang: "en", desc: "" }],
  timer: [
    { id: 2, status: false, lang: "en", desc: "Language" },
    { id: 3, status: true, lang: "en", desc: "Inspection" },
    { id: 4, status: false, lang: "en", desc: "Start cue" },
    { id: 5, status: true, lang: "en", desc: "Hold to start" },
    { id: 6, status: false, lang: "en", desc: "Manual mode" },
  ],
  features: [
    { id: 7, status: true, lang: "en", desc: "Scramble image" },
    { id: 8, status: true, lang: "en", desc: "Session stats" },
    { id: 9, status: true, lang: "en", desc: "Quick action buttons" },
    { id: 10, status: false, lang: "en", desc: "Hide time while solving" },
    { id: 11, status: true, lang: "en", desc: "Scramble background" },
  ],
  alerts: [
    { id: 12, status: false, lang: "en", desc: "Best time" },
    { id: 13, status: false, lang: "en", desc: "Best average" },
    { id: 14, status: false, lang: "en", desc: "Worst time" },
  ],
};
