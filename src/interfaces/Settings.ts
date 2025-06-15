import { Colors } from "@/interfaces/types/colors";

interface Timer {
  inspection: boolean;
  startCue: boolean;
  holdToStart: boolean;
  manualMode: boolean;
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

export interface Settings {
  timer: Timer;
  features: Features;
  alerts: Alerts;
  preferences: Preferences;
}
