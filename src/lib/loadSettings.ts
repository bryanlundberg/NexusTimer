import { Settings } from "@/interfaces/Settings";
import { defaultSettings } from "./const/defaultSettings";

function areSettingsDifferent(
  currentSettings: Settings,
  defaultSettings: Settings
) {
  return JSON.stringify(currentSettings) !== JSON.stringify(defaultSettings);
}

function mergeSettings(currentSettings: Settings, defaultSettings: Settings) {
  return {
    ...defaultSettings,
    ...currentSettings,
  };
}

/**
 * Retrieves the user settings from local storage.
 * If no settings are found, it initializes and saves the default settings.
 *
 * @returns {Settings} The user settings.
 */
export default function loadSettings(): Settings {
  // Retrieve settings data from local storage
  const data = window.localStorage.getItem("settings");

  // Check if settings data is not available
  if (!data) {
    // Initialize and save default settings to local storage
    window.localStorage.setItem("settings", JSON.stringify(defaultSettings));

    // Return the default settings
    return defaultSettings;
  }

  const currentSettings: Settings = JSON.parse(data);

  if (areSettingsDifferent(currentSettings, defaultSettings)) {
    const updatedSettings = mergeSettings(currentSettings, defaultSettings);
    window.localStorage.setItem("settings", JSON.stringify(updatedSettings));

    return updatedSettings;
  }

  return currentSettings;
}
