import { Colors } from "@/interfaces/types/colors";

interface Timer {
  inspection: { status: boolean; key: string };
  startCue: { status: boolean; key: string };
  holdToStart: { status: boolean; key: string };
  manualMode: { status: boolean; key: string };
}

interface Features {
  scrambleImage: { status: boolean; key: string };
  sessionStats: { status: boolean; key: string };
  quickActionButtons: { status: boolean; key: string };
  hideWhileSolving: { status: boolean; key: string };
  scrambleBackground: { status: boolean; key: string };
}

interface Alerts {
  bestTime: { status: boolean; key: string };
  bestAverage: { status: boolean; key: string };
  worstTime: { status: boolean; key: string };
}

interface Preferences {
  defaultCube: { id: string | null; key: string };
  colorTheme: { value: Colors; key: string };
}

interface Sounds {
  newPersonalBest: { status: boolean; key: string };
}

export interface Settings {
  timer: Timer;
  features: Features;
  alerts: Alerts;
  preferences: Preferences;
  sounds: Sounds;
}
