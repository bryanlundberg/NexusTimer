import { Settings } from "@/interfaces/Settings";

export default function loadSettings() {
  const defaultSettings: Settings = {
    language: "es",
    inspection: false,
    startCue: true,
    holdToStart: false,
    backCancelsSolve: true,
    manualMode: false,
    scrambleImage: false,
    sessionStats: false,
    quickActionButtons: true,
    hideTimeWhileSolving: false,
    scrambleBackground: false,
    bestTime: true,
    bestAverage: true,
    worstTime: false,
  };

  const data = window.localStorage.getItem("settings");
  if (!data) {
    window.localStorage.setItem("settings", JSON.stringify(defaultSettings));
    return defaultSettings;
  }

  const settings = JSON.parse(data);
  console.log(settings);
  return settings;
}
