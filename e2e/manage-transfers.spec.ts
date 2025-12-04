import { test, expect } from '@playwright/test'
import { createCube } from './utils/create-cube'
import { solveOnTimer } from './utils/solve-on-timer'

test.describe('Manage Transfers Page', () => {
  test.beforeEach(async ({ page }) => {
    await createCube(page, 'AnotherCube1', '2x2')
    await createCube(page, 'AnotherCube2', '2x2')
    await createCube(page, 'AnotherCube3', '3x3')

    await page.getByTestId('utilize-cube-button-AnotherCube1').click()

    await solveOnTimer(page, 0, 0)
    await solveOnTimer(page, 0, 1)

    await expect(page.getByTestId('timer-session-count')).toBeVisible()
    await page.getByRole('link', { name: 'Transfer' }).click()
    await expect(page.getByTestId('empty-solves-grid')).toBeVisible()
  })

  test('should display the correct amount of transferable solves', async ({ page }) => {
    await page.getByTestId('source-collection-trigger').click()
    await page.getByTestId('source-collection-AnotherCube1').click()
    const elements = page.locator('[data-testid^="solve-card-"]')
    await expect(elements).toHaveCount(2)
  })

  test('should display the correct source of cubes available for transfer', async ({ page }) => {
    // Verify with all cubes
    await page.getByTestId('source-collection-trigger').click()
    await expect(page.getByTestId('source-collection-AnotherCube2')).toBeVisible()
    await expect(page.getByTestId('source-collection-AnotherCube1')).toBeVisible()
    await expect(page.getByTestId('source-collection-AnotherCube3')).toBeVisible()
    await page.locator('html').click()
    await expect(page.getByTestId('source-collection-AnotherCube2')).toBeHidden()
    await expect(page.getByTestId('source-collection-AnotherCube1')).toBeHidden()
    await expect(page.getByTestId('source-collection-AnotherCube3')).toBeHidden()

    // Verify with a deleted cube
    await page.getByRole('link', { name: 'Cubes' }).click()

    await expect(page.getByTestId('cube-name-AnotherCube2')).toBeVisible()
    await page.getByTestId('delete-cube-button-AnotherCube2').click()
    await expect(page.getByTestId('dialog-delete-cube-container')).toBeVisible()
    await page.getByTestId('dialog-delete-cube-input').click()
    await page.getByTestId('dialog-delete-cube-input').fill('AnotherCube2')
    await page.getByTestId('dialog-delete-cube-accept-button').click()
    await expect(page.getByTestId('dialog-delete-cube-container')).toBeHidden()
    await expect(page.getByTestId('cube-name-AnotherCube2')).toBeHidden()

    await page.getByRole('link', { name: 'Transfer' }).click()

    await page.getByTestId('source-collection-trigger').click()
    await expect(page.getByTestId('source-collection-AnotherCube3')).toBeVisible()
    await expect(page.getByTestId('source-collection-AnotherCube1')).toBeVisible()
  })

  test('should list the correct list of target cubes for transfer related to the same category of first cube', async ({
    page
  }) => {})

  test('should transfer solves from source cube to target cube', async ({ page }) => {})

  test('should not transfer solves when none are selected', async ({ page }) => {})

  test('should not list deleted solves as available for transfer', async ({ page }) => {})
})
