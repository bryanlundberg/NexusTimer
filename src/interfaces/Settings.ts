import { Language } from "./types/Language";

interface LocaleItem {
  lang: Language;
  key: string;
}

interface TimerItem {
  status: boolean;
  key: string;
}

interface FeatureItem {
  status: boolean;
  key: string;
}

interface AlertItem {
  status: boolean;
  key: string;
}

export interface ThemeItem {
  bg?: string;
  text?: string;
  key: string;
}

export interface Settings {
  locale: LocaleItem[];
  timer: TimerItem[];
  features: FeatureItem[];
  alerts: AlertItem[];
  theme: ThemeItem[];
}
