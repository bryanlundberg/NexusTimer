import { Settings } from "@/interfaces/Settings";
import { buildSettingsObject } from "./settingsUtils";

/**
 * Retrieves the user settings from local storage.
 * If old settings format is found, it migrates to the new format.
 * Each setting is stored as its own key in localStorage.
 *
 * @returns {Settings} The user settings.
 */
export default function loadSettings(): Settings {
  return buildSettingsObject();
}
