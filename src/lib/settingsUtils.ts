import { Settings } from "@/interfaces/Settings";
import { defaultSettings } from "./const/defaultSettings";
import _ from "lodash";

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
  const settings: Settings = _.cloneDeep(defaultSettings);

  settings.timer.inspection = getSetting('timer.inspection', settings.timer.inspection);
  settings.timer.inspectionTime = getSetting('timer.inspectionTime', settings.timer.inspectionTime);
  settings.timer.startCue = getSetting('timer.startCue', settings.timer.startCue);
  settings.timer.holdToStart = getSetting('timer.holdToStart', settings.timer.holdToStart);
  settings.timer.holdToStartTime = getSetting('timer.holdToStartTime', settings.timer.holdToStartTime);
  settings.timer.manualMode = getSetting('timer.manualMode', settings.timer.manualMode);
  settings.timer.decimals = getSetting('timer.decimals', settings.timer.decimals);

  Object.entries(settings.features).forEach(([name]) => {
    settings.features[name as keyof typeof settings.features] = getSetting(`features.${name}`, settings.features[name as keyof typeof settings.features]);
  });

  Object.entries(settings.alerts).forEach(([name]) => {
    settings.alerts[name as keyof typeof settings.alerts] = getSetting(`alerts.${name}`, settings.alerts[name as keyof typeof settings.alerts]);
  });

  settings.preferences.defaultCube = getSetting('preferences.defaultCube', settings.preferences.defaultCube);
  settings.preferences.colorTheme = getSetting('preferences.colorTheme', settings.preferences.colorTheme);

  return _.cloneDeep(settings);
}

/**
 * Saves the complete settings object to localStorage
 * @param settings The settings object to save
 */
export function saveSettings(settings: Settings): void {
  Object.entries(settings.timer).forEach(([name, value]) => {
    setSetting(`timer.${name}`, value);
  });

  Object.entries(settings.features).forEach(([name, value]) => {
    setSetting(`features.${name}`, value);
  });

  Object.entries(settings.alerts).forEach(([name, value]) => {
    setSetting(`alerts.${name}`, value);
  });

  setSetting('preferences.defaultCube', settings.preferences.defaultCube);
  setSetting('preferences.colorTheme', settings.preferences.colorTheme);
}
