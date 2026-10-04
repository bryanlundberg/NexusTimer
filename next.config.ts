import createNextIntlPlugin from 'next-intl/plugin'
import { withSerwist } from '@serwist/turbopack'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./src/shared/config/i18n/request.ts')

const DEV_API_ORIGIN = process.env.DEV_API_ORIGIN ?? 'http://localhost:4100'

const DEV_API_PREFIXES = [
  '/api/health',
  '/api/auth',
  '/api/v1/realtime',
  '/api/v1/leaderboards',
  '/api/v1/search',
  '/api/v1/trainer',
  '/api/v1/shared-solves',
  '/api/v1/users',
  '/api/v1/friends',
  '/api/v1/blocks',
  '/api/v1/privacy',
  '/api/v1/presence'
]

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ['@nexustimer/algorithms', '@nexustimer/contracts'],
  async rewrites() {
    if (process.env.NODE_ENV !== 'development') return []
    return DEV_API_PREFIXES.flatMap((prefix) => [
      { source: prefix, destination: `${DEV_API_ORIGIN}${prefix}` },
      { source: `${prefix}/:path*`, destination: `${DEV_API_ORIGIN}${prefix}/:path*` }
    ])
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
