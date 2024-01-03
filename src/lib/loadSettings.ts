import { Settings } from "@/interfaces/Settings";
import { defaultSettings } from "./const/defaultSettings";

/**
 * Retrieves the user settings from the local storage.
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

  // Parse and return the retrieved settings
  const settings = JSON.parse(data);
  return settings;
}
