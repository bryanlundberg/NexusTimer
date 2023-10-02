import { defaultSettings } from "./defaultSettings";

export default function loadSettings() {
  const data = window.localStorage.getItem("settings");
  if (!data) {
    window.localStorage.setItem("settings", JSON.stringify(defaultSettings));
    return defaultSettings;
  }
  const settings = JSON.parse(data);
  return settings;
}
