import { formatTime, isValidSlug, type SharedSolveDetail } from '@nexustimer/contracts'
import type { Env } from './env'
import { apiGet } from './proxy'

const SITE_ORIGIN = 'https://nexustimer.com'
const API_TIMEOUT_MS = 3000

export type SharedSolveMeta = { title: string; description: string; canonical: string }

export function sharedSolveMeta(solve: SharedSolveDetail): SharedSolveMeta {
  const time = solve.dnf ? 'DNF' : `${formatTime(solve.time)}${solve.plus2 ? '+' : ''}`
  return {
    title: `${time} ${solve.puzzle} · ${solve.author.name}`,
    description: solve.scramble,
    canonical: `${SITE_ORIGIN}/s/${solve.slug}`
  }
}

const setContent = (value: string) => ({
  element(element: Element) {
    element.setAttribute('content', value)
  }
})

export function applySharedSolveMeta(shell: Response, meta: SharedSolveMeta): Response {
  let hasCanonical = false
  return new HTMLRewriter()
    .on('title', {
      element(element) {
        element.setInnerContent(meta.title)
      }
    })
    .on('meta[name="description"]', setContent(meta.description))
    .on('meta[property="og:title"]', setContent(meta.title))
    .on('meta[property="og:description"]', setContent(meta.description))
    .on('meta[property="og:url"]', setContent(meta.canonical))
    .on('meta[property="og:type"]', setContent('article'))
    .on('meta[name="twitter:card"]', setContent('summary'))
    .on('meta[name="twitter:title"]', setContent(meta.title))
    .on('meta[name="twitter:description"]', setContent(meta.description))
    .on('link[rel="canonical"]', {
      element(element) {
        hasCanonical = true
        element.setAttribute('href', meta.canonical)
      }
    })
    .on('head', {
      element(element) {
        element.onEndTag((end) => {
          if (!hasCanonical) end.before(`<link rel="canonical" href="${meta.canonical}"/>`, { html: true })
        })
      }
    })
    .transform(shell)
}

const withStatus = (shell: Response, status: number) => new Response(shell.body, { status, headers: shell.headers })

export async function sharedSolvePage(shell: Response, slug: string, env: Env): Promise<Response> {
  if (!isValidSlug(slug)) return withStatus(shell, 404)

  let solve: SharedSolveDetail
  try {
    const res = await apiGet(env, `/api/v1/shared-solves/${slug}`, API_TIMEOUT_MS)
    if (res.status === 404) return withStatus(shell, 404)
    if (!res.ok) return shell
    solve = await res.json()
  } catch {
    return shell
  }
  return applySharedSolveMeta(shell, sharedSolveMeta(solve))
}
