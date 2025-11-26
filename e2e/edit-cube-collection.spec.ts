import { expect } from '@playwright/test'
import { test } from './fixtures/create-cube-fixture'
import { getIndexedDBData } from './utils/indexdb-helpers'

test('should edit a cube collection and validate IndexedDB data', async ({ cubeCreated }) => {
  await cubeCreated.goto('http://localhost:3000/cubes')
  await expect(
    cubeCreated
      .locator('div')
      .filter({ hasText: /^TestCube$/ })
      .first()
  ).toBeVisible()

  const data = await getIndexedDBData(cubeCreated)

  expect(data.length).toBe(1)
  expect(data[0].name).toBe('TestCube')
  expect(data[0].category).toBe('Clock')

  await cubeCreated.getByRole('button', { name: 'Edit' }).click()
  await expect(cubeCreated.getByText('Modifying the collection')).toBeVisible()
  await cubeCreated.getByTestId('drawer-edit-input-name').click()
  await cubeCreated.getByTestId('drawer-edit-input-name').fill('Test2')
  await cubeCreated.getByTestId('drawer-edit-accept-button').click()
  await expect(
    cubeCreated
      .locator('div')
      .filter({ hasText: /^Test2$/ })
      .first()
  ).toBeVisible()

  const dataAfterEdit1 = await getIndexedDBData(cubeCreated)
  expect(dataAfterEdit1.length).toBe(1)
  expect(dataAfterEdit1[0].name).toBe('Test2')
  expect(dataAfterEdit1[0].category).toBe('Clock')

  await cubeCreated.getByRole('button', { name: 'Edit' }).click()
  await cubeCreated.getByTestId('drawer-edit-select-category').click()
  await cubeCreated.getByRole('option', { name: 'Pyraminx' }).click()
  await cubeCreated.getByTestId('drawer-edit-accept-button').click()
  await cubeCreated.waitForTimeout(500)
  await expect(cubeCreated.getByText('Pyraminx')).toBeVisible()

  const dataAfterEdit2 = await getIndexedDBData(cubeCreated)
  expect(dataAfterEdit2.length).toBe(1)
  expect(dataAfterEdit2[0].name).toBe('Test2')
  expect(dataAfterEdit2[0].category).toBe('Pyraminx')
})
