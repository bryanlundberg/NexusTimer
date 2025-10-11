import { Colors } from "@/interfaces/types/colors";

interface Timer {
  inspection: boolean;
  startCue: boolean;
  holdToStart: boolean;
  inspectionTime: number;
  holdToStartTime: number;
  decimals: number;
}

interface Features {
  scrambleImage: boolean;
  sessionStats: boolean;
  quickActionButtons: boolean;
  hideWhileSolving: boolean;
  scrambleBackground: boolean;
}

interface Alerts {
  bestTime: boolean;
  bestAverage: boolean;
  worstTime: boolean;
}

interface Preferences {
  defaultCube: string;
  colorTheme: Colors;
}

interface Sounds {
  newPersonalBest: boolean;
}

export interface Sync {
  autoSaveEnabled: boolean;
  autoLoadEnabled: boolean;
  backupInterval: number;
  lastSync: number;
  totalSolves: number;
}

export interface Settings {
  timer: Timer;
  features: Features;
  alerts: Alerts;
  preferences: Preferences;
  sounds: Sounds;
  sync: Sync;
}
