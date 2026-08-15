import { test, type Page, type Response } from '@playwright/test'
import type { CubeCategory } from '@/shared/const/cube-categories'
import { saveDiscovered, type DiscoveredProduct } from './utils/catalog-api'

const urls = [
  'https://www.thecubicle.com/collections/2x2-speed-cubes?filter.p.product_type=2x2',
  'https://www.thecubicle.com/collections/3x3-speed-cubes?filter.p.product_type=3x3',
  'https://www.thecubicle.com/collections/4x4-speed-cubes?filter.p.product_type=4x4',
  'https://www.thecubicle.com/collections/5x5-speed-cubes?filter.p.product_type=5x5',
  'https://www.thecubicle.com/collections/6x6-speed-cubes?filter.p.product_type=6x6',
  'https://www.thecubicle.com/collections/7x7-speed-cubes?filter.p.product_type=7x7',
  'https://www.thecubicle.com/collections/megaminx?filter.p.product_type=Megaminx',
  'https://www.thecubicle.com/collections/pyraminx?filter.p.product_type=Pyraminx',
  'https://www.thecubicle.com/collections/skewb?filter.p.product_type=Skewb',
  'https://www.thecubicle.com/collections/square-1?filter.p.product_type=Square-1',
  'https://www.thecubicle.com/collections/fto?filter.p.product_type=3x3%2CShape%20Mods'
]

const EMPTY_NOTICE =
  'Sorry, there are no products matching your search. If you have filters applied, try removing some to see results.'

// The source site rate limits with a 429 and a verification interstitial.
const PAGE_DELAY = 600
const MAX_RETRIES = 3
const COOLDOWN_MS = 60000

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

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
  'square-1': 'SQ1',
  fto: 'FTO'
}

function resolveProduct(url: string): DiscoveredProduct | null {
  const collectionSlug = url.match(/\/collections\/([^/]+)\/products\//)?.[1]?.toLowerCase()
  const id = url.match(/\/products\/([^/?#]+)/)?.[1]

  if (!collectionSlug || !id) return null

  const category = CATEGORY_BY_COLLECTION[collectionSlug]

  if (!category) {
    console.warn(`Unmapped collection: "${collectionSlug}" (${url})`)
    return null
  }

  return { id, url, collectionSlug, category }
}

async function dumpPage(page: Page, response: Response | null, label: string) {
  const counts = await page
    .evaluate(() => ({
      grids: document.querySelectorAll('.product-card-grid').length,
      anchors: document.querySelectorAll('.product-card-grid a').length,
      productLinks: document.querySelectorAll('a[href*="/products/"]').length
    }))
    .catch(() => null)

  const title = await page.title().catch(() => '(unavailable)')
  const text = await page.evaluate(() => document.body?.innerText ?? '').catch(() => '')

  console.error(`[${label}] HTTP ${response?.status() ?? 'no response'} ${response?.statusText() ?? ''}`)
  console.error(`[${label}] title: "${title}"`)

  if (counts) {
    console.error(
      `[${label}] .product-card-grid: ${counts.grids} · anchors inside it: ${counts.anchors} · any /products/ link: ${counts.productLinks}`
    )

    if (counts.grids === 0 && counts.productLinks > 0) {
      console.error(`[${label}] The page has product links but no .product-card-grid: the markup changed.`)
    }
  }

  console.error(`[${label}] visible text (first 800 chars):\n${text.slice(0, 800)}`)
}

test('Collect all product URLs', async ({ browser }) => {
  test.setTimeout(0)

  const page = await browser.newPage()
  const allProducts: string[][] = []
  let totalReceived = 0
  let totalInserted = 0

  try {
    for (const baseUrl of urls) {
      const productUrls: string[] = []
      let currentPage = 1

      while (true) {
        const url = `${baseUrl}&page=${currentPage}`

        console.log(`[${baseUrl}] page ${currentPage}`)

        let response: Response | null = null
        let links: string[] = []
        let exhausted = false

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
          response = await page.goto(url, { waitUntil: 'domcontentloaded' })

          if (response && !response.ok()) {
            console.warn(`[${baseUrl}] page ${currentPage}: HTTP ${response.status()} ${response.statusText()}`)
          }

          const notice = page.getByText(EMPTY_NOTICE)

          await Promise.race([
            page.locator('.product-card-grid a').first().waitFor({ state: 'attached', timeout: 30_000 }),
            notice.waitFor({ state: 'visible', timeout: 30_000 })
          ]).catch(() => null)

          if (await notice.isVisible().catch(() => false)) {
            exhausted = true
            break
          }

          links = await page.$$eval('.product-card-grid a', (elements) => [
            ...new Set(elements.map((a) => (a as HTMLAnchorElement).href))
          ])

          if (links.length > 0) break

          if (attempt < MAX_RETRIES) {
            const wait = COOLDOWN_MS * attempt
            console.warn(
              `[${baseUrl}] page ${currentPage}: nothing rendered (attempt ${attempt}/${MAX_RETRIES}), backing off ${wait / 1000}s`
            )
            await sleep(wait)
          }
        }

        if (exhausted) break

        if (links.length === 0) {
          await dumpPage(page, response, `${baseUrl} page ${currentPage}`)
          throw new Error(
            `[${baseUrl}] page ${currentPage}: neither products nor the empty-state notice rendered after ${MAX_RETRIES} attempts`
          )
        }

        console.log(`[${baseUrl}] page ${currentPage}: ${links.length} products`)

        productUrls.push(...links)
        currentPage++

        await sleep(PAGE_DELAY + Math.random() * PAGE_DELAY)
      }

      console.log(`[${baseUrl}] found: ${productUrls.length}`)

      allProducts.push(productUrls)

      // Saved per collection, so a later failure does not throw away the crawl.
      const byId = new Map<string, DiscoveredProduct>()
      for (const url of productUrls) {
        const product = resolveProduct(url)
        if (product && !byId.has(product.id)) byId.set(product.id, product)
      }

      const { received, inserted } = await saveDiscovered([...byId.values()])
      totalReceived += received
      totalInserted += inserted

      console.log(`[${baseUrl}] saved: ${received} · new: ${inserted}`)
    }
  } finally {
    await page.close().catch(() => {})
  }

  console.log(`\nSent: ${totalReceived} · new: ${totalInserted}`)

  const empty = urls.filter((_, i) => allProducts[i].length === 0)
  if (empty.length > 0) {
    throw new Error(`${empty.length} collection(s) returned no products:\n  ${empty.join('\n  ')}`)
  }
})
