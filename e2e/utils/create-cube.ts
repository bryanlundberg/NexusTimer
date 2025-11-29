import { Page, expect } from '@playwright/test'
import { getIndexedDBData } from './indexdb-helpers'
import { CubeCategory } from '@/shared/const/cube-categories'

export async function createCube(page: Page, name: string = 'TestCube', category: CubeCategory = 'Clock') {
  await page.goto('/cubes')
  await page.getByTestId('create-collection-button').click()

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

  const newCube = data.find((cube) => cube.name === name && cube.category === category && !cube.isDeleted)

  expect(newCube).toBeDefined()
  expect(newCube?.createdAt).toBeDefined()
  expect(newCube?.updatedAt).toBeDefined()
  expect(newCube?.id).toBeDefined()
  expect(newCube?.solves).toBeDefined()
  expect(newCube?.solves.all.length).toBe(0)
  expect(newCube?.solves.session.length).toBe(0)
  expect(newCube?.isDeleted).toBeFalsy()
  expect(newCube?.name).toBe(name)
  expect(newCube?.category).toBe(category)
}
