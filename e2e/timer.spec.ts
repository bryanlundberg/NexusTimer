import { expect, test } from '@playwright/test'
import { getIndexedDBData } from './utils/indexdb-helpers'
import { solveOnTimer } from './utils/solve-on-timer'
import { createCube } from './utils/create-cube'

test.describe.configure({ mode: 'serial' })

test.describe('Timer Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await createCube(page, 'TestCube', '3x3')
    await expect(page.getByTestId('main-cube-selector')).toContainText('Select')
    await page.getByTestId('utilize-cube-button-TestCube').click()
    await expect(page.getByTestId('main-cube-selector')).toContainText('TestCube')
    await expect(page.getByText('Press SPACE to start')).toBeVisible()
  })

  test('Should perform a solve using the timer', async ({ page }) => {
    await solveOnTimer(page, 0, 0)
    await expect(page.getByTestId('timer-widgets-container')).toBeVisible()
    const data = await getIndexedDBData(page)
    expect(data[0].solves.session.length).toBe(1)
    expect(data[0].solves.all.length).toBe(0)
  })

  test('should add a plus two penalty to the solve (quick-actions-menu)', async ({ page }) => {
    await solveOnTimer(page, 0, 0)
    await expect(page.getByTestId('quick-action-buttons')).toBeVisible()
    await page.getByTestId('plus-two-button').click()
  })

  test('should mark the solve as DNF (quick-actions-menu)', async ({ page }) => {})

  test('should delete the solve (quick-actions-menu)', async ({ page }) => {})

  test('should bookmark the solve (quick-actions-menu)', async ({ page }) => {})
})
