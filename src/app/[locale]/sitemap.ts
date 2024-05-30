import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.nexustimer.pro/",
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: "https://www.nexustimer.pro/solves",
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: "https://www.nexustimer.pro/stats",
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: "https://www.nexustimer.pro/cubes",
      lastModified: new Date(),
      priority: 0.8,
    },
  ];
}
