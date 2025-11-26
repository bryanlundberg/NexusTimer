import { test } from './fixtures/create-cube-fixture'
import { expect } from '@playwright/test'
import { getIndexedDBData } from './utils/indexdb-helpers'

test('should delete a cube collection, also validate delete form', async ({ cubeCreated }) => {
  await cubeCreated.goto('http://localhost:3000/cubes')
  await expect(
    cubeCreated
      .locator('div')
      .filter({ hasText: /^TestCube$/ })
      .first()
  ).toBeVisible()
  await cubeCreated.getByRole('button', { name: 'Delete' }).click()
  await expect(cubeCreated.getByTestId('dialog-delete-cube-description')).toBeVisible()
  await cubeCreated.getByTestId('dialog-delete-cube-input').click()
  await cubeCreated.getByTestId('dialog-delete-cube-input').fill('asd')
  await cubeCreated.getByTestId('dialog-delete-cube-accept-button').click()
  await expect(cubeCreated.getByTestId('dialog-delete-cube-error-message')).toBeVisible()
  await cubeCreated.getByTestId('dialog-delete-cube-input').click()
  await cubeCreated.getByTestId('dialog-delete-cube-input').fill('')
  await cubeCreated.getByTestId('dialog-delete-cube-input').press('CapsLock')
  await cubeCreated.getByTestId('dialog-delete-cube-input').fill('T')
  await cubeCreated.getByTestId('dialog-delete-cube-input').press('CapsLock')
  await cubeCreated.getByTestId('dialog-delete-cube-input').fill('Test')
  await cubeCreated.getByTestId('dialog-delete-cube-input').press('CapsLock')
  await cubeCreated.getByTestId('dialog-delete-cube-input').fill('TestC')
  await cubeCreated.getByTestId('dialog-delete-cube-input').press('CapsLock')
  await cubeCreated.getByTestId('dialog-delete-cube-input').fill('TestCube')
  await cubeCreated.getByTestId('dialog-delete-cube-accept-button').click()
  await expect(cubeCreated.getByText('Collection deleted')).toBeVisible()
  await expect(cubeCreated.getByRole('heading', { name: 'No cubes for display.' })).toBeVisible()

  const data = await getIndexedDBData(cubeCreated)

  expect(data.length).toBe(1)
  expect(data[0].name).toBe('TestCube')
  expect(data[0].isDeleted).toBeTruthy()
})
