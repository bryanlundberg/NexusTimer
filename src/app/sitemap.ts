import { locales } from "@/i18n/locales";
import { MetadataRoute } from "next";

const host = "https://nexustimer.com";

export default function sitemap(): MetadataRoute.Sitemap {
  function generateAlternates(url: string) {
    return {
      languages: Object.fromEntries(
        locales.map((locale) => [locale, `${host}/${url}`])
      ),
    };
  }

  return [
    {
      url: host,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
      alternates: generateAlternates("/"),
    },
    {
      url: `${host}/account`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.8,
      alternates: generateAlternates("/settings/account"),
    },
    {
      url: `${host}/solves`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.8,
      alternates: generateAlternates("/solves"),
    },
    {
      url: `${host}/stats`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.8,
      alternates: generateAlternates("/stats"),
    },
    {
      url: `${host}/cubes`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.8,
      alternates: generateAlternates("/cubes"),
    },
  ];
}
