import { Page, expect } from '@playwright/test'
import { getIndexedDBData } from './indexdb-helpers'
import { CubeCategory } from '@/shared/const/cube-categories'

export async function createCube(page: Page, name: string = 'TestCube', category: CubeCategory = 'Clock') {
  await page.goto('/cubes')
  await expect(page.getByTestId('empty-cubes-container')).toBeVisible()
  await page.getByTestId('empty-cubes-create-button').click()
  await expect(page.getByTestId('drawer-create-collection')).toBeVisible()
  await page.getByTestId('drawer-input-name').click()
  await page.getByTestId('drawer-input-name').fill(name)
  await expect(page.getByTestId(`checkbox-category-${category}`)).toBeVisible()
  await page.getByTestId(`checkbox-category-${category}`).click()
  await expect(page.getByText(`Current selection: ${category}`)).toBeVisible()
  await expect(page.getByTestId('drawer-accept-button')).toBeVisible()
  await page.getByTestId('drawer-accept-button').click()
  await expect(page.getByTestId('drawer-create-collection')).toBeHidden()

  const data = await getIndexedDBData(page)

  expect(data.length).toBe(1)
  expect(data[0].name).toBe(name)
  expect(data[0].category).toBe(category)
  expect(data[0].solves.session.length).toBe(0)
  expect(data[0].solves.all.length).toBe(0)
  expect(data[0].isDeleted).toBeFalsy()
  expect(data[0].createdAt).toBeDefined()
  expect(data[0].updatedAt).toBeDefined()
  expect(data[0].id).toBeDefined()
}
