import { test, type Browser, type Page } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { isValidCategory, type CubeCategory } from '@/shared/const/cube-categories'

const data = JSON.parse(fs.readFileSync('cubes.json', 'utf8'))
const urls: string[] = data.products

const CATEGORY: CubeCategory = '3x3'

const OUT_DIR = 'scraped-products'

const CATEGORY_BY_COLLECTION: Record<string, CubeCategory> = {
  '2x2-speed-cubes': '2x2',
  '3x3-speed-cubes': '3x3',
  '4x4-speed-cubes': '4x4',
  '5x5-speed-cubes': '5x5',
  '6x6-speed-cubes': '6x6',
  '7x7-speed-cubes': '7x7',
  megaminx: 'Megaminx',
  pyraminx: 'Pyraminx',
  skewb: 'Skewb',
  'square-1': 'SQ1'
}

function resolveCategory(url: string): CubeCategory | null {
  const slug = url.match(/\/collections\/([^/]+)\/products\//)?.[1]?.toLowerCase()

  if (!slug) return null

  const category = CATEGORY_BY_COLLECTION[slug]

  if (!category || !isValidCategory(category)) {
    console.warn(`Unmapped collection: "${slug}" (${url})`)
    return null
  }

  return category
}

// Unique id = product handle (slug in /products/<handle>). Valid as a Meilisearch id.
function resolveId(url: string): string | null {
  return url.match(/\/products\/([^/?#]+)/)?.[1] ?? null
}

function fileSafe(category: CubeCategory): string {
  return category.replace(/[^a-z0-9]+/gi, '_')
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const CONCURRENCY = 4
const MAX_RETRIES = 4
const RECYCLE_EVERY = 80
const NAV_TIMEOUT = 45000
const REQUEST_DELAY = 300
const COOLDOWN_AFTER = 8
const COOLDOWN_MS = 60000
const SAVE_EVERY = 10

async function makeContext(browser: Browser) {
  const context = await browser.newContext()
  await context.route('**/*', (route) => {
    const type = route.request().resourceType()
    if (['image', 'stylesheet', 'font', 'media'].includes(type)) route.abort()
    else route.continue()
  })
  return context
}

async function extractProduct(page: Page) {
  const product = await page.evaluate(() => {
    const brandLines = [...document.querySelectorAll('[itemprop="brand"] strong')]
      .map((e) => e.textContent?.trim())
      .filter(Boolean)

    const brand = [...new Set(brandLines)]

    const image =
      document.querySelector('.product-images-main-swiper-slide-image-wrapper img')?.getAttribute('src') ?? null

    const name = document.querySelector('[itemprop="name"]')?.textContent?.trim() ?? null

    const specs: Record<string, any> = {}

    document.querySelectorAll('table tbody tr').forEach((row) => {
      const th = row.querySelector('th')
      const td = row.querySelector('td')

      if (!th || !td) return

      const key = th.textContent!.trim()

      let values = [...td.querySelectorAll('strong, a, span')].map((el) => el.textContent?.trim()).filter(Boolean)

      if (values.length === 0) {
        values = [td.textContent?.trim()].filter(Boolean)
      }

      values = [...new Set(values)]

      values = values.map((v) => v?.replace(/\s+/g, ' ').trim()).filter(Boolean)

      specs[key] = values.length > 1 ? values : values.length === 1 ? values[0] : null
    })

    return { name, brand, image, specs }
  })

  return {
    ...product,
    image: product.image ? (product.image.startsWith('//') ? 'https:' + product.image : product.image) : null
  }
}

async function scrapeUrls(
  browser: Browser,
  pending: string[],
  category: CubeCategory,
  onResult: (result: any) => void
): Promise<void> {
  let cursor = 0
  let done = 0
  let consecutiveFailures = 0
  let cooldownUntil = 0

  async function worker() {
    let context = await makeContext(browser)
    let sinceRecycle = 0

    try {
      while (true) {
        const i = cursor++
        if (i >= pending.length) break

        const url = pending[i]
        const id = resolveId(url)

        const wait = cooldownUntil - Date.now()
        if (wait > 0) await sleep(wait)

        if (sinceRecycle >= RECYCLE_EVERY) {
          await context.close().catch(() => {})
          context = await makeContext(browser)
          sinceRecycle = 0
        }

        let ok = false
        let lastError: any

        for (let attempt = 1; attempt <= MAX_RETRIES && !ok; attempt++) {
          const page = await context.newPage()
          try {
            await page.goto(url, {
              waitUntil: 'domcontentloaded',
              timeout: NAV_TIMEOUT
            })
            const product = await extractProduct(page)
            onResult({ id, url, category, ...product })
            ok = true
            consecutiveFailures = 0
          } catch (error: any) {
            lastError = error
            await sleep(800 * attempt)
          } finally {
            await page.close().catch(() => {})
          }
        }

        if (!ok) {
          console.error(`[${category}] ${url} -> ${lastError?.message} (after ${MAX_RETRIES} retries)`)
          onResult({ id, url, category, error: lastError?.message ?? 'unknown' })

          consecutiveFailures++
          if (consecutiveFailures >= COOLDOWN_AFTER && Date.now() >= cooldownUntil) {
            cooldownUntil = Date.now() + COOLDOWN_MS
            consecutiveFailures = 0
            console.warn(
              `[${category}] ${COOLDOWN_AFTER} failures in a row: pausing ${COOLDOWN_MS / 1000}s (likely rate limit).`
            )
          }
        }

        sinceRecycle++
        done++
        if (done % 25 === 0) {
          console.log(`[${category}] ${done}/${pending.length} (this run)`)
        }

        if (REQUEST_DELAY > 0) {
          await sleep(REQUEST_DELAY + Math.random() * REQUEST_DELAY)
        }
      }
    } finally {
      await context.close().catch(() => {})
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()))
}

// Scrapes the CATEGORY above, resuming from any previous run.
test(`Scrape ${CATEGORY}`, async ({ browser }) => {
  test.setTimeout(0)

  fs.mkdirSync(OUT_DIR, { recursive: true })
  const file = path.join(OUT_DIR, `${fileSafe(CATEGORY)}.json`)

  const byId = new Map<string, any>()
  if (fs.existsSync(file)) {
    for (const r of JSON.parse(fs.readFileSync(file, 'utf8'))) {
      if (r?.id) byId.set(r.id, r)
    }
  }

  const allUrls = urls.filter((url) => resolveCategory(url) === CATEGORY)
  if (allUrls.length === 0) {
    throw new Error(`No URLs for category "${CATEGORY}" in cubes.json`)
  }

  // Pending = not yet ok (missing or previously errored).
  const pending = allUrls.filter((url) => {
    const id = resolveId(url)
    if (!id) return false
    const prev = byId.get(id)
    return !prev || prev.error
  })

  console.log(
    `[${CATEGORY}] total ${allUrls.length} · done ${allUrls.length - pending.length} · pending ${pending.length}`
  )

  const persist = () => {
    const ordered = allUrls.map((url) => byId.get(resolveId(url)!)).filter(Boolean)
    fs.writeFileSync(file, JSON.stringify(ordered, null, 2))
  }

  if (pending.length === 0) {
    persist()
    console.log(`[${CATEGORY}] already complete (${byId.size}).`)
    return
  }

  let sinceSave = 0
  await scrapeUrls(browser, pending, CATEGORY, (result) => {
    if (result.id) byId.set(result.id, result)
    if (++sinceSave >= SAVE_EVERY) {
      persist()
      sinceSave = 0
    }
  })

  persist()

  const ordered = allUrls.map((url) => byId.get(resolveId(url)!)).filter(Boolean)
  const failed = ordered.filter((r) => r?.error).length

  console.log(`[${CATEGORY}] ${ordered.length} products (${failed} failed) -> ${file}`)
  if (failed > 0) {
    console.log(`[${CATEGORY}] Re-run the same test to retry the ${failed} failed ones.`)
  }
})
