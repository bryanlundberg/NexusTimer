import { defaultCache } from '@serwist/next/worker'
import type { PrecacheEntry, RuntimeCaching, SerwistGlobalConfig } from 'serwist'
import { ExpirationPlugin, NetworkFirst, Serwist } from 'serwist'
import { AUTH_SESSION_CACHE } from '../shared/lib/authSessionCache'

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope

// Pages are static and carry no user data, so the last known session is what keeps the app signed in offline.
const authSessionCache: RuntimeCaching = {
  matcher: ({ sameOrigin, url: { pathname } }) => sameOrigin && pathname === '/api/auth/session',
  method: 'GET',
  handler: new NetworkFirst({
    cacheName: AUTH_SESSION_CACHE,
    networkTimeoutSeconds: 3,
    plugins: [new ExpirationPlugin({ maxEntries: 1 })]
  })
}

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [authSessionCache, ...defaultCache]
})

serwist.addEventListeners()
