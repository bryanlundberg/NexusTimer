import { test, expect } from "@playwright/test";

test('Should collect algorithms', async ({ page }) => {
  await page.goto('');

  const rows = await page.$$eval('.row.singlealgorithm.g-0', (elements) => {
    return elements.map((el) => {
      const name = el.querySelector('h2.mb-0 > a')?.textContent?.trim() || '';
      const group = el.querySelector('div:nth-child(5) > a')?.textContent?.trim() || '';
      const setup = el.querySelector('.setup-case.align-items-center')?.textContent?.trim().slice(6) || '';
      const algs = Array.from(el.querySelectorAll('.formatted-alg')).map(a => a.textContent?.trim() || '')
      return { name, group, setup, algs };
    });
  });

  console.log(rows);
  expect(rows?.length).toBeGreaterThan(0);
});
