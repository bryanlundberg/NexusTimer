import { test } from '@playwright/test'
import { writeFile } from 'fs/promises'

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

test('Collect all product URLs', async ({ browser }) => {
  test.setTimeout(0)

  const allProducts = await Promise.all(
    urls.map(async (baseUrl) => {
      const page = await browser.newPage()

      const productUrls: string[] = []
      let currentPage = 1

      while (true) {
        const url = `${baseUrl}&page=${currentPage}`

        console.log(`[${baseUrl}] page ${currentPage}`)

        await page.goto(url, { waitUntil: 'domcontentloaded' })

        const notice = page.getByText(EMPTY_NOTICE)

        await Promise.race([
          page.locator('.product-card-grid a').first().waitFor({ state: 'attached', timeout: 30_000 }),
          notice.waitFor({ state: 'visible', timeout: 30_000 })
        ]).catch(() => null)

        if (await notice.isVisible().catch(() => false)) break

        const links = await page.$$eval('.product-card-grid a', (elements) => [
          ...new Set(elements.map((a) => (a as HTMLAnchorElement).href))
        ])

        if (links.length === 0) {
          throw new Error(`[${baseUrl}] page ${currentPage}: neither products nor the empty-state notice rendered`)
        }

        console.log(`[${baseUrl}] page ${currentPage}: ${links.length} products`)

        productUrls.push(...links)
        currentPage++
      }

      await page.close()

      console.log(`[${baseUrl}] found: ${productUrls.length}`)

      return productUrls
    })
  )

  const productUrls = [...new Set(allProducts.flat())]

  const empty = urls.filter((_, i) => allProducts[i].length === 0)
  if (empty.length > 0) {
    throw new Error(`${empty.length} collection(s) returned no products:\n  ${empty.join('\n  ')}`)
  }

  await writeFile('cubes.json', JSON.stringify({ total: productUrls.length, products: productUrls }, null, 2), 'utf8')

  console.log(`\nUnique products: ${productUrls.length}`)
  console.log('cubes.json written.')
})
