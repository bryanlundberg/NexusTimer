import { spawnSync } from 'node:child_process'
import { createSerwistRoute } from '@serwist/turbopack'

const revision =
  process.env.VERCEL_GIT_COMMIT_SHA ||
  spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf-8' }).stdout?.trim() ||
  crypto.randomUUID()

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute({
  additionalPrecacheEntries: [{ url: '/~offline', revision }],
  // Only what the timer needs offline; the rest of public is cached on first use.
  globPatterns: [
    '.next/static/**/*.{js,css,html,ico,apng,png,avif,jpg,jpeg,jfif,pjpeg,pjp,gif,svg,webp,json,webmanifest}',
    'public/{sounds,categories,icons}/**/*',
    'public/vendors/**/*.js'
  ],
  swSrc: 'src/app/sw.ts',
  useNativeEsbuild: true
})
