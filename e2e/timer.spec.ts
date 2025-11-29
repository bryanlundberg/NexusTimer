import { expect, test } from '@playwright/test'
import { getIndexedDBData } from './utils/indexdb-helpers'
import { solveOnTimer } from './utils/solve-on-timer'
import { createCube } from './utils/create-cube'

test('Should perform a solve using the timer', async ({ page }) => {
  await createCube(page)
  await page.getByRole('button', { name: 'Utilize' }).click()
  await expect(page.getByText('Press SPACE to start')).toBeVisible()

  await solveOnTimer(page, 0, 0)

  await expect(page.getByTestId('timer-widgets-container')).toBeVisible()

  const data = await getIndexedDBData(page)

  expect(data[0].solves.session.length).toBe(1)
  expect(data[0].solves.all.length).toBe(0)
})
