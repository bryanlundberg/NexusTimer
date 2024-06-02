import { createSharedPathnamesNavigation } from "next-intl/navigation";

export const defaultLocale = "en";
export const localePrefix = "always";
export const locales = [
  "en",
  "de",
  "bn",
  "cs",
  "es",
  "et",
  "fi",
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
  "tr",
  "uk",
  "vi",
  "zh",
] as const;
export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales, localePrefix });
