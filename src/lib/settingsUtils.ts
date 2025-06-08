import { Settings } from "@/interfaces/Settings";
import { defaultSettings } from "./const/defaultSettings";

/**
 * Gets a setting value from localStorage by its key
 * @param key The unique key for the setting
 * @param defaultValue The default value to return if the setting doesn't exist
 * @returns The setting value or the default value
 */
export function getSetting<T>(key: string, defaultValue: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error(`Error getting setting ${key}:`, error);
    return defaultValue;
  }
}

/**
 * Sets a setting value in localStorage by its key
 * @param key The unique key for the setting
 * @param value The value to store
 */
export function setSetting<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting setting ${key}:`, error);
  }
}

/**
 * Builds a settings object from individual localStorage keys
 * @returns The complete settings object
 */
export function buildSettingsObject(): Settings {
  const settings: Settings = JSON.parse(JSON.stringify(defaultSettings));

  Object.entries(settings.timer).forEach(([name, setting]) => {
    settings.timer[name as keyof typeof settings.timer].status = getSetting(setting.key, setting.status);
  });

  Object.entries(settings.features).forEach(([name, setting]) => {
    settings.features[name as keyof typeof settings.features].status = getSetting(setting.key, setting.status);
  });

  Object.entries(settings.alerts).forEach(([name, setting]) => {
    settings.alerts[name as keyof typeof settings.alerts].status = getSetting(setting.key, setting.status);
  });

  settings.preferences.defaultCube.id = getSetting(settings.preferences.defaultCube.key, settings.preferences.defaultCube.id);
  settings.preferences.colorTheme.value = getSetting(settings.preferences.colorTheme.key, settings.preferences.colorTheme.value);

  return settings;
}
