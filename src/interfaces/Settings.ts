import { Language } from "./types/Language";
import { Themes } from "./types/Themes";

interface Locale {
  language: { lang: Language; key: string };
}

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

interface Theme {
  background: { color: Themes; key: string };
  content: { color: string; key: string };
}

export interface Settings {
  locale: Locale;
  timer: Timer;
  features: Features;
  alerts: Alerts;
  theme: Theme;
}
