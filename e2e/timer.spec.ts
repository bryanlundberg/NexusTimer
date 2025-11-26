import { expect } from '@playwright/test'
import { test } from './fixtures/create-cube-fixture'
import { getIndexedDBData } from './utils/indexdb-helpers'

test('Should do a solve with the timer', async ({ cubeCreated }) => {
  await cubeCreated.waitForTimeout(250)
  await cubeCreated.getByRole('button', { name: 'Utilize' }).click()
  await cubeCreated.waitForTimeout(250)
  await cubeCreated.getByRole('main').locator('div').filter({ hasText: /^0$/ }).click()

  await cubeCreated.keyboard.down('Space')
  await cubeCreated.waitForTimeout(1000)
  await cubeCreated.keyboard.up('Space')

  await cubeCreated.waitForTimeout(1000)
  await cubeCreated.keyboard.press('Space')

  await expect(cubeCreated.getByText('Congratulations!')).toBeVisible()

  const data = await getIndexedDBData(cubeCreated)

  expect(data[0].solves.session.length).toBe(1)
  expect(data[0].solves.all.length).toBe(0)
})
