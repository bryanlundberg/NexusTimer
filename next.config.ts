import createNextIntlPlugin from 'next-intl/plugin'
import { withSerwist } from '@serwist/turbopack'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./src/shared/config/i18n/request.ts')

const DEV_API_ORIGIN = process.env.DEV_API_ORIGIN ?? 'http://localhost:4100'
const isDev = process.env.NODE_ENV === 'development'

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  ...(isDev
    ? { rewrites: async () => [{ source: '/api/:path*', destination: `${DEV_API_ORIGIN}/api/:path*` }] }
    : { output: 'export' as const }),
  reactCompiler: true,
  transpilePackages: [
    '@nexustimer/algorithms',
    '@nexustimer/contracts',
    '@nexustimer/stats',
    '@nexustimer/tnoodle-lib-rs'
  ],
  experimental: {
    globalNotFound: true,
    turbopackFileSystemCacheForDev: true,
    turbopackRustReactCompiler: process.env.NODE_ENV !== 'production'
  },
  allowedDevOrigins: ['*.trycloudflare.com'],
  images: {
    loader: 'custom',
    loaderFile: './src/shared/lib/image-loader.ts'
  }
}

export default withSerwist(withNextIntl(nextConfig))
