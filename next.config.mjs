import createNextIntlPlugin from "next-intl/plugin";
import withSerwistInit from "@serwist/next";

const withNextIntl = createNextIntlPlugin('./src/shared/config/i18n/request.ts');

const withSerwist = withSerwistInit({
  swSrc: "/src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV !== "PRODUCTION"
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  experimental: {
    turbopackFileSystemCacheForDev: true
  },
  images: {
    remotePatterns: [
      {
        hostname: "res.cloudinary.com"
      },
      {
        hostname: "cdn.jsdelivr.net"
      }
    ]
  }
};

export default withSerwist(withNextIntl(nextConfig));
