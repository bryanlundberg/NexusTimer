import { createSharedPathnamesNavigation } from "next-intl/navigation";

export const defaultLocale = "en";
export const localePrefix = "never"; // Default
export const locales = [
  "en",
  "de",
  "bn",
  "cs",
  "da",
  "el",
  "es",
  "et",
  "fi",
  "fil",
  "fr",
  "hi",
  "hu",
  "id",
  "it",
  "ja",
  "ko",
  "ms",
  "ms",
  "nl",
  "no",
  "pl",
  "pt",
  "ro",
  "ru",
  "sk",
  "sv",
  "th",
  "tr",
  "uk",
  "vi",
  "zh",
] as const;
export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales, localePrefix });
