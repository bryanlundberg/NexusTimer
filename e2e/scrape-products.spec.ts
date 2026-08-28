import { test, type Browser, type Page } from '@playwright/test'
import { isValidCategory, type CubeCategory } from '@/shared/const/cube-categories'
import { fetchPending, saveScraped, type ScrapedProduct } from './utils/catalog-api'

function resolveTargetCategory(): CubeCategory {
  const fromEnv = process.env.SCRAPE_CATEGORY?.trim()

  if (!fromEnv) return '3x3'

  if (!isValidCategory(fromEnv)) {
    throw new Error(`SCRAPE_CATEGORY="${fromEnv}" is not a valid cube category`)
  }

  return fromEnv
}

const CATEGORY: CubeCategory = resolveTargetCategory()

const MAX_WARNINGS = 25
let warnings = 0
let missingSpecs = 0

function warn(message: string) {
  if (warnings >= MAX_WARNINGS) return

  warnings++
  console.warn(message)

  if (warnings === MAX_WARNINGS) {
    console.warn(`[${CATEGORY}] further per-URL warnings suppressed, see the totals at the end.`)
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const CONCURRENCY = 1
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
      .filter((value): value is string => Boolean(value))

    const brand = [...new Set(brandLines)]

    const image =
      document.querySelector('.product-images-main-swiper-slide-image-wrapper img')?.getAttribute('src') ?? null

    const name = document.querySelector('[itemprop="name"]')?.textContent?.trim() ?? null

    const specs: Record<string, unknown> = {}

    document.querySelectorAll('table tbody tr').forEach((row) => {
      const th = row.querySelector('th')
      const td = row.querySelector('td')

      if (!th || !td) return

      const key = th.textContent!.trim()

      let values = [...td.querySelectorAll('strong, a, span')]
        .map((el) => el.textContent?.trim())
        .filter((value): value is string => Boolean(value))

      if (values.length === 0) {
        values = [td.textContent?.trim()].filter((value): value is string => Boolean(value))
      }

      values = [...new Set(values)]

      values = values.map((v) => v.replace(/\s+/g, ' ').trim()).filter(Boolean)

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
  pending: Array<{ id: string; url: string }>,
  category: CubeCategory,
  onResult: (result: ScrapedProduct) => Promise<void>
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

        const { id, url } = pending[i]

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
            const response = await page.goto(url, {
              waitUntil: 'domcontentloaded',
              timeout: NAV_TIMEOUT
            })

            // A rate limit answers 200 with a verification page, so these retry
            // instead of storing the product empty and marking it done.
            if (response && !response.ok()) {
              throw new Error(`HTTP ${response.status()} ${response.statusText()}`)
            }

            const product = await extractProduct(page)

            if (!product.name) {
              throw new Error('no [itemprop="name"] on the page')
            }

            if (Object.keys(product.specs).length === 0) {
              missingSpecs++
              warn(`[${category}] no spec table rows found at ${url}`)
            }

            await onResult({ id, ...product })
            ok = true
            consecutiveFailures = 0
          } catch (error: any) {
            lastError = error
            warn(
              `[${category}] attempt ${attempt}/${MAX_RETRIES} failed for ${url}: ${String(error?.message).split('\n')[0]}`
            )
            await sleep(800 * attempt)
          } finally {
            await page.close().catch(() => {})
          }
        }

        if (!ok) {
          console.error(`[${category}] ${url} -> ${lastError?.message} (after ${MAX_RETRIES} retries)`)
          await onResult({ id, error: lastError?.message ?? 'unknown' })

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
          console.log(`[${category}] ${done}/${pending.length}`)
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

test(`Scrape ${CATEGORY}`, async ({ browser }) => {
  test.setTimeout(0)

  const pending = await fetchPending(CATEGORY)
  console.log(`[${CATEGORY}] pending ${pending.length}`)

  if (pending.length === 0) return

  let failed = 0
  const buffer: ScrapedProduct[] = []

  const flush = async () => {
    if (buffer.length === 0) return
    await saveScraped(buffer.splice(0))
  }

  await scrapeUrls(browser, pending, CATEGORY, async (result) => {
    if ('error' in result) failed++
    buffer.push(result)
    if (buffer.length >= SAVE_EVERY) await flush()
  })

  await flush()

  console.log(`[${CATEGORY}] ${pending.length} processed, ${failed} failed`)

  if (failed > 0) {
    console.log(`[${CATEGORY}] The failed ones stay pending and are retried on the next run.`)
  }

  if (missingSpecs > 0) {
    console.log(`[${CATEGORY}] ${missingSpecs} stored without specs.`)
  }
})
