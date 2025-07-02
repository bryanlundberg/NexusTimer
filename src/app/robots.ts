import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const sitemaps = [
    "https://nexustimer.com/sitemap.xml"
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/private/",
          "/api/",
          "/_next/",
          "/server-sitemap.xml",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/private/",
          "/api/",
        ],
      },
    ],
    sitemap: sitemaps,
    host: "https://nexustimer.com",
  };
}
