import { locales } from "@/navigation";

interface LanguageProp {
  code: (typeof locales)[number];
  name: string;
}

export const languages: LanguageProp[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "ja", name: "日本語" },
  { code: "zh", name: "中文" },
  { code: "ru", name: "Русский" },
  { code: "hi", name: "हिन्दी" },
  { code: "pt", name: "Português" },
  { code: "it", name: "Italiano" },
  { code: "ko", name: "한국어" },
  { code: "nl", name: "Nederlands" },
  { code: "sv", name: "Svenska" },
  { code: "tr", name: "Türkçe" },
  { code: "pl", name: "Polski" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "fi", name: "Suomi" },
  { code: "uk", name: "Українська" },
  { code: "cs", name: "Čeština" },
  { code: "ro", name: "Română" },
  { code: "no", name: "Norsk" },
  { code: "ms", name: "Bahasa Melayu" },
  { code: "hu", name: "Magyar" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "bn", name: "বাংলা" },
  { code: "sk", name: "Slovenčina" },
  { code: "et", name: "Eesti" },
];
