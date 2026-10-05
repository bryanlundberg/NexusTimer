/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { defaultCache } from '@serwist/turbopack/worker'
import type { PrecacheEntry, RuntimeCaching, SerwistGlobalConfig, SerwistPlugin } from 'serwist'
import { CacheFirst, ExpirationPlugin, NetworkFirst, Serwist } from 'serwist'
import { AUTH_SESSION_CACHE } from '../shared/lib/authSessionCache'
import { defaultLocale, LOCALE_COOKIE, locales, localizedPath } from '../shared/config/i18n/locales'

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

const OFFLINE_URL = '/~offline'
const PAGES_CACHE = 'pages-documents'
const PAYLOADS_CACHE = 'pages-payloads'
const OFFLINE_CACHE = 'pages-offline'
const PAYLOAD_SUFFIX = '.txt'
const CORE_PAGES = ['/app', '/solves', '/options', '/cubes', '/transfer-solves']

const isPage = (url: URL) =>
  url.origin === self.location.origin && !/^\/(api|_next)(\/|$)/.test(url.pathname) && !/\.[^/]+$/.test(url.pathname)

const pageKey = (url: string) => {
  const key = new URL(url)
  key.search = ''
  key.hash = ''
  return key.href
}

const pathLocale = (pathname: string): string | undefined => {
  const prefix = pathname.split('/')[1]
  return locales.includes(prefix) ? prefix : undefined
}

// Same order as applySavedLocale: url prefix, locale cookie, then browser languages.
const preferredLocale = async (pathname: string) => {
  const prefixed = pathLocale(pathname)
  if (prefixed) return prefixed
  const cookie = await self.cookieStore?.get(LOCALE_COOKIE).catch(() => null)
  const candidates = [cookie?.value, ...navigator.languages.flatMap((tag) => [tag, tag.split('-')[0]])]
  return candidates.find((tag) => tag && locales.includes(tag)) ?? defaultLocale
}

const offlinePage = async (pathname: string) => {
  const url = localizedPath(await preferredLocale(pathname), OFFLINE_URL)
  return (await caches.match(url, { cacheName: OFFLINE_CACHE })) ?? serwist.matchPrecache(OFFLINE_URL)
}

// Unprefixed pages are always the default locale.
const saveOfflinePage = async (pageUrl: string) => {
  const url = localizedPath(pathLocale(new URL(pageUrl).pathname) ?? defaultLocale, OFFLINE_URL)
  const cache = await caches.open(OFFLINE_CACHE)
  if (await cache.match(url)) return
  const response = await fetch(url)
  if (response.ok && !response.redirected) await cache.put(url, response)
}

// Query strings only carry client state, and a redirected response cannot answer a navigation.
const pageCache: SerwistPlugin = {
  cacheKeyWillBeUsed: async ({ request }) => pageKey(request.url),
  cacheWillUpdate: async ({ response }) => (response.ok && !response.redirected ? response : null),
  cacheDidUpdate: async ({ request }) => saveOfflinePage(request.url).catch(() => undefined)
}

const pageExpiration = new ExpirationPlugin({ maxEntries: 32 })

// An unprefixed URL that was never saved, such as the manifest start_url, opens a saved localized copy.
const pageFallback: SerwistPlugin = {
  handlerDidError: async ({ request }) => {
    const { pathname } = new URL(request.url)
    const localized = new Set(locales.map((locale) => localizedPath(locale, pathname)))
    localized.delete(pathname)
    const saved = await (await caches.open(PAGES_CACHE)).keys()
    const match = saved.findLast((key) => localized.has(new URL(key.url).pathname))
    return match ? Response.redirect(match.url, 302) : offlinePage(pathname)
  }
}

// Turbopack passes a worker's config in the script URL fragment. A cached response carries its own URL without it,
// while a fresh Response takes the request URL, fragment included.
// github.com/vercel/next.js/issues/99389
const workerScripts: SerwistPlugin = {
  handlerWillRespond: async ({ request, response }) =>
    request.destination === 'worker' ? new Response(response.body, response) : response
}

const pageNavigations: RuntimeCaching = {
  matcher: ({ request, url }) => request.mode === 'navigate' && isPage(url),
  method: 'GET',
  handler: new NetworkFirst({
    cacheName: PAGES_CACHE,
    networkTimeoutSeconds: 3,
    plugins: [pageCache, pageExpiration, pageFallback]
  })
}

// Pages opened through client-side navigation, sent by SerwistProvider as CACHE_URLS.
const pageWarmups: RuntimeCaching = {
  matcher: ({ request, url }) => request.mode !== 'navigate' && !request.headers.has('RSC') && isPage(url),
  method: 'GET',
  handler: new CacheFirst({
    cacheName: PAGES_CACHE,
    plugins: [pageCache, pageExpiration]
  })
}

// Static export payloads do not vary with _rsc.
const pagePayloads: RuntimeCaching = {
  matcher: ({ request, url, sameOrigin }) =>
    sameOrigin && request.headers.get('RSC') === '1' && url.pathname.endsWith(PAYLOAD_SUFFIX),
  method: 'GET',
  handler: new NetworkFirst({
    cacheName: PAYLOADS_CACHE,
    networkTimeoutSeconds: 3,
    plugins: [
      { cacheKeyWillBeUsed: async ({ request }) => pageKey(request.url) },
      new ExpirationPlugin({ maxEntries: 64 })
    ]
  })
}

// Pages are static and carry no user data, so the last known session is what keeps the app signed in offline.
const authSessionCache: RuntimeCaching = {
  matcher: ({ sameOrigin, url: { pathname } }) => sameOrigin && pathname === '/api/auth/get-session',
  method: 'GET',
  handler: new NetworkFirst({
    cacheName: AUTH_SESSION_CACHE,
    networkTimeoutSeconds: 3,
    matchOptions: { ignoreSearch: true },
    plugins: [new ExpirationPlugin({ maxEntries: 1 })]
  })
}

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: { plugins: [workerScripts] },
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [authSessionCache, pageNavigations, pageWarmups, pagePayloads, ...defaultCache],
  fallbacks: {
    entries: [
      {
        url: OFFLINE_URL,
        matcher({ request }) {
          return request.destination === 'document'
        }
      }
    ]
  }
})

// Saved pages reference the chunks of the deploy that rendered them, which this worker no longer precaches.
const renewPages = async (event: ExtendableEvent) => {
  const cache = await caches.open(PAGES_CACHE)
  const saved = await cache.keys()
  const open = (await self.clients.matchAll({ type: 'window', includeUncontrolled: true }))
    .map((client) => new URL(client.url))
    .filter(isPage)
  const pageLocales = open.length
    ? open.map(({ pathname }) => pathLocale(pathname) ?? defaultLocale)
    : [await preferredLocale('/')]
  await Promise.all([
    caches.delete(OFFLINE_CACHE),
    caches.delete(PAYLOADS_CACHE),
    ...saved.map((key) => cache.delete(key))
  ])
  const warm = (url: string, headers?: HeadersInit) =>
    serwist.handleRequest({ request: new Request(url, { headers, signal: AbortSignal.timeout(5000) }), event })
  await Promise.allSettled(
    [...new Set(pageLocales)]
      .flatMap((locale) => CORE_PAGES.map((page) => localizedPath(locale, page)))
      .flatMap((url) => [warm(url), warm(`${url}${PAYLOAD_SUFFIX}`, { RSC: '1' })])
  )
}

self.addEventListener('activate', (event) => event.waitUntil(renewPages(event)))

serwist.addEventListeners()
