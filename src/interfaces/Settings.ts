import { Language } from "./types/Language";

interface LocaleItem {
  lang: Language;
  translationKey: string;
  id: number;
}

interface TimerItem {
  status: boolean;
  translationKey: string;
  id: number;
}

interface FeatureItem {
  status: boolean;
  translationKey: string;
  id: number;
}

interface AlertItem {
  status: boolean;
  translationKey: string;
  id: number;
}

export interface ThemeItem {
  bg?: string;
  text?: string;
  translationKey: string;
  id: number;
}

export interface Settings {
  locale: LocaleItem[];
  timer: TimerItem[];
  features: FeatureItem[];
  alerts: AlertItem[];
  theme: ThemeItem[];
}
