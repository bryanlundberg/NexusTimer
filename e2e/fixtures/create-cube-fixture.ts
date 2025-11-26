import { expect, test as base, Page } from '@playwright/test'
import { getIndexedDBData } from '../utils/indexdb-helpers'

type CubeFixtures = {
  cubeCreated: Page
}

export const test = base.extend<CubeFixtures>({
  cubeCreated: async ({ page }, use) => {
    await page.goto('http://localhost:3000/cubes')
    await expect(page.getByRole('heading', { name: 'No cubes for display.' })).toBeVisible()
    await page.getByTestId('empty-cubes-container').getByRole('button', { name: 'New collection' }).click()
    await page.getByTestId('drawer-input-name').click()
    await page.getByTestId('drawer-input-name').fill('TestCube')
    await expect(page.getByTestId('checkbox-category-2x2')).toBeVisible()
    await expect(page.getByTestId('checkbox-category-3x3')).toBeVisible()
    await expect(page.getByTestId('checkbox-category-3x3 OH')).toBeVisible()
    await expect(page.getByTestId('checkbox-category-4x4')).toBeVisible()
    await expect(page.getByTestId('checkbox-category-5x5')).toBeVisible()
    await expect(page.getByTestId('checkbox-category-6x6')).toBeVisible()
    await expect(page.getByTestId('checkbox-category-7x7')).toBeVisible()
    await expect(page.getByTestId('checkbox-category-SQ1')).toBeVisible()
    await expect(page.getByTestId('checkbox-category-Skewb')).toBeVisible()
    await expect(page.getByTestId('checkbox-category-Pyraminx')).toBeVisible()
    await expect(page.getByTestId('checkbox-category-Megaminx')).toBeVisible()
    await expect(page.getByTestId('checkbox-category-Clock')).toBeVisible()
    await page.getByTestId('checkbox-category-4x4').click()
    await expect(page.getByText('Current selection: 4x4')).toBeVisible()
    await page.getByTestId('checkbox-category-SQ1').click()
    await expect(page.getByText('Current selection: SQ1')).toBeVisible()
    await page.getByTestId('checkbox-category-Clock').click()
    await expect(page.getByText('Current selection: Clock')).toBeVisible()
    await page.getByTestId('drawer-accept-button').click()
    await expect(
      page
        .locator('div')
        .filter({ hasText: /^TestCube$/ })
        .first()
    ).toBeVisible()

    await page.waitForTimeout(500)
    const data = await getIndexedDBData(page)

    expect(data.length).toBe(1)
    expect(data[0].name).toBe('TestCube')
    expect(data[0].category).toBe('Clock')
    expect(data[0].solves.session.length).toBe(0)
    expect(data[0].solves.all.length).toBe(0)
    expect(data[0].isDeleted).toBeFalsy()
    expect(data[0].createdAt).toBeDefined()
    expect(data[0].updatedAt).toBeDefined()
    expect(data[0].id).toBeDefined()

    await use(page)
  }
})
