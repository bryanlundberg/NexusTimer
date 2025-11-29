import { test } from './fixtures/create-cube-fixture'
import { solveOnTimer } from './utils/solve-on-timer'
import { expect } from '@playwright/test'
import { getIndexedDBData } from './utils/indexdb-helpers'

test('should do multiple solves and visualize correctly on solves page', async ({ cubeCreated }) => {
  await cubeCreated.waitForTimeout(250)
  await cubeCreated.getByRole('button', { name: 'Utilize' }).click()
  await cubeCreated.waitForTimeout(250)
  await cubeCreated.getByRole('main').locator('div').filter({ hasText: /^0$/ }).click()

  await solveOnTimer(cubeCreated, 0, 0)
  await solveOnTimer(cubeCreated, 0, 1)

  await expect(cubeCreated.getByTestId('timer-session-count')).toBeVisible()

  const cubes = await getIndexedDBData(cubeCreated)

  expect(cubes[0].solves.session.length).toBe(2)
  expect(cubes[0].solves.all.length).toBe(0)
})
