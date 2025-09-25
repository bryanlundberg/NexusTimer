import { locales } from "@/i18n/locales";
import { MetadataRoute } from "next";

const host = "https://nexustimer.com";

export default function sitemap(): MetadataRoute.Sitemap {
  function generateAlternates(path: string) {
    return {
      languages: Object.fromEntries(
        locales.map((locale) => [locale, `${host}${path}`])
      ),
    };
  }

  const pages = [
    { path: "/", priority: 1.0 },
    { path: "/app", priority: 0.9 },
    { path: "/people", priority: 0.9 },
    { path: "/clash", priority: 0.8 },
    { path: "/solves", priority: 0.8 },
    { path: "/stats", priority: 0.8 },
    { path: "/cubes", priority: 0.8 },
    { path: "/transfer-solves", priority: 0.8 },
    { path: "/options", priority: 0.7 },
    { path: "/privacy-policy", priority: 0.6 },
    { path: "/terms-of-service", priority: 0.6 },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  pages.forEach(({ path, priority }) => {
    sitemapEntries.push({
      url: `${host}${path}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority,
      alternates: generateAlternates(path),
    });
  });

  return sitemapEntries;
}
