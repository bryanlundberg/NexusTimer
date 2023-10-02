import { Settings } from "@/interfaces/Settings";

export const defaultSettings: Settings = {
  locale: [{ id: 1, status: true, lang: "es", desc: "" }],
  timer: [
    { id: 2, status: false, desc: "Language" },
    { id: 3, status: true, desc: "Inspection" },
    { id: 4, status: false, desc: "Start cue" },
    { id: 5, status: true, desc: "Hold to start" },
    { id: 6, status: false, desc: "Manual mode" },
  ],
  features: [
    { id: 7, status: true, desc: "Scramble image" },
    { id: 8, status: true, desc: "Session stats" },
    { id: 9, status: true, desc: "Quick action buttons" },
    { id: 10, status: false, desc: "Hide time while solving" },
    { id: 11, status: true, desc: "Scramble background" },
  ],
  alerts: [
    { id: 12, status: false, desc: "Best time" },
    { id: 13, status: false, desc: "Best average" },
    { id: 14, status: false, desc: "Worst time" },
  ],
};
