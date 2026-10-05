import { DYNAMIC_PAGE_ROUTES, STATIC_ROUTE_PLACEHOLDER } from '@nexustimer/contracts'
import { splitLocale } from './locale'

const API_PREFIX = '/api'
const SEGMENT_FILE_PREFIX = '__next.'
const PAYLOAD_SUFFIX = '.txt'
const HOME_PATH = '/app'
const SIGN_IN_PATH = '/sign-in'

export const SIGNED_OUT_PAGES = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password']
export const SIGNED_IN_PAGES = ['/friends', '/messages']

export function isApiPath(pathname: string) {
  return pathname === API_PREFIX || pathname.startsWith(`${API_PREFIX}/`)
}

export type PageRoute =
  | { kind: 'gated'; requiresSession: boolean; fallback: string }
  | { kind: 'dynamic'; base: string; id: string; assetPath: string; isDocument: boolean }
  | { kind: 'asset' }

export function resolvePage(pathname: string): PageRoute {
  const { locale, path } = splitLocale(pathname)
  const prefix = locale ? `/${locale}` : ''
  if (SIGNED_OUT_PAGES.includes(path))
    return { kind: 'gated', requiresSession: false, fallback: `${prefix}${HOME_PATH}` }
  if (SIGNED_IN_PAGES.includes(path))
    return { kind: 'gated', requiresSession: true, fallback: `${prefix}${SIGN_IN_PATH}` }

  for (const base of DYNAMIC_PAGE_ROUTES) {
    if (!path.startsWith(`${base}/`)) continue

    const [segment = '', ...rest] = path.slice(base.length + 1).split('/')
    if (!segment || segment.startsWith(SEGMENT_FILE_PREFIX)) return { kind: 'asset' }

    const isPayload = rest.length === 0 && segment.endsWith(PAYLOAD_SUFFIX)
    const id = isPayload ? segment.slice(0, -PAYLOAD_SUFFIX.length) : segment
    if (id === STATIC_ROUTE_PLACEHOLDER) return { kind: 'asset' }

    const suffix = isPayload ? PAYLOAD_SUFFIX : rest.length ? `/${rest.join('/')}` : ''
    return {
      kind: 'dynamic',
      base,
      id,
      assetPath: `${prefix}${base}/${STATIC_ROUTE_PLACEHOLDER}${suffix}`,
      isDocument: !isPayload && rest.length === 0
    }
  }

  return { kind: 'asset' }
}
