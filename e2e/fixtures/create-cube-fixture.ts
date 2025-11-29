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
    await expect(page.getByTestId('drawer-create-collection')).toBeVisible()
    await page.getByTestId('drawer-input-name').click()
    await page.getByTestId('drawer-input-name').fill('TestCube')
    await expect(page.getByTestId('checkbox-category-4x4')).toBeVisible()
    await page.getByTestId('checkbox-category-4x4').click()
    await expect(page.getByText('Current selection: 4x4')).toBeVisible()
    await page.getByTestId('checkbox-category-SQ1').click()
    await expect(page.getByText('Current selection: SQ1')).toBeVisible()
    await page.getByTestId('checkbox-category-Clock').click()
    await expect(page.getByText('Current selection: Clock')).toBeVisible()
    await expect(page.getByTestId('drawer-accept-button')).toBeVisible()
    await page.getByTestId('drawer-accept-button').click()
    await expect(page.getByTestId('drawer-create-collection')).toBeHidden()

    await expect(
      page
        .locator('div')
        .filter({ hasText: /^TestCube$/ })
        .first()
    ).toBeVisible()

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
