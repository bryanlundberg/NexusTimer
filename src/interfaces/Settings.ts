import { Language } from "./types/Language";

export interface Settings {
  locale: Item[];
  timer: Item[];
  features: Item[];
  alerts: Item[];
}

export interface Item {
  id: number;
  status: boolean;
  lang: Language;
  translationKey: string;
}
