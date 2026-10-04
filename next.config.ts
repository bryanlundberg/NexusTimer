import createNextIntlPlugin from 'next-intl/plugin'
import { withSerwist } from '@serwist/turbopack'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./src/shared/config/i18n/request.ts')

const DEV_API_ORIGIN = process.env.DEV_API_ORIGIN ?? 'http://localhost:4000'

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ['@nexustimer/algorithms', '@nexustimer/contracts'],
  async rewrites() {
    if (process.env.NODE_ENV !== 'development') return []
    return [{ source: '/api/:path*', destination: `${DEV_API_ORIGIN}/api/:path*` }]
  },
  experimental: {
    globalNotFound: true,
    turbopackFileSystemCacheForDev: true,
    turbopackRustReactCompiler: process.env.NODE_ENV !== 'production'
  },
  allowedDevOrigins: ['*.trycloudflare.com'],
  images: {
    remotePatterns: [
      {
        hostname: 'res.cloudinary.com'
      },
      {
        hostname: 'cdn.jsdelivr.net'
      }
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), geolocation=()'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          }
        ]
      }
    ]
  }
}

export default withSerwist(withNextIntl(nextConfig))
