import { test, expect } from '@playwright/test'
import { createCube } from './utils/create-cube'
import { solveOnTimer } from './utils/solve-on-timer'
import { getIndexedDBData } from './utils/indexdb-helpers'

test.describe('Manage Transfers Page', () => {
  test.beforeEach(async ({ page }) => {
    await createCube(page, 'AnotherCube1', '2x2')
    await createCube(page, 'AnotherCube2', '2x2')
    await createCube(page, 'AnotherCube3', '3x3')

    await page.getByTestId('utilize-cube-button-AnotherCube1').click()

    await solveOnTimer(page, 'AnotherCube1', 0)
    await solveOnTimer(page, 'AnotherCube1', 1)

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
  }) => {
    await page.getByTestId('source-collection-trigger').click()
    await expect(page.getByTestId('source-collection-AnotherCube2')).toBeVisible()
    await expect(page.getByTestId('source-collection-AnotherCube1')).toBeVisible()
    await expect(page.getByTestId('source-collection-AnotherCube3')).toBeVisible()
    await page.getByTestId('source-collection-AnotherCube1').click()

    await expect(page.getByTestId('source-collection-AnotherCube2')).toBeHidden()
    await expect(page.getByTestId('source-collection-AnotherCube1')).toBeHidden()
    await expect(page.getByTestId('source-collection-AnotherCube3')).toBeHidden()

    await page.getByTestId('destination-collection-trigger').click()
    await expect(page.getByTestId('destination-collection-AnotherCube2')).toBeVisible()
    await expect(page.getByTestId('destination-collection-AnotherCube3')).toBeVisible()
  })

  test('should transfer solves from source cube to target cube', async ({ page }) => {
    await page.getByTestId('source-collection-trigger').click()
    await page.getByTestId('source-collection-AnotherCube1').click()

    await page.getByTestId('destination-collection-trigger').click()
    await page.getByTestId('destination-collection-AnotherCube2').click()

    const firstSolve = page.locator('[data-testid^="solve-card-"]').first()
    await firstSolve.click()

    await page.getByTestId('transfer-solves-button').click()

    await expect(async () => {
      const elements = page.locator('[data-testid^="solve-card-"]')
      await expect(elements).toHaveCount(1)
    }).toPass()

    const data = await getIndexedDBData(page)
    const sourceCube = data.find((cube) => cube.name === 'AnotherCube1')
    const targetCube = data.find((cube) => cube.name === 'AnotherCube2')

    expect(sourceCube?.solves.session.length).toBe(2)
    expect(targetCube?.solves.session.length).toBe(1)

    const sourceSolve = sourceCube?.solves.session[0]
    const transferredSolve = targetCube?.solves.session[0]
    expect(transferredSolve).toMatchObject({
      id: sourceSolve?.id,
      time: sourceSolve?.time,
      scramble: sourceSolve?.scramble,
      dnf: sourceSolve?.dnf,
      plus2: sourceSolve?.plus2,
      rating: sourceSolve?.rating,
      startTime: sourceSolve?.startTime,
      endTime: sourceSolve?.endTime,
      isDeleted: false,
      cubeId: targetCube?.id,
      bookmark: sourceSolve?.bookmark
    })

    expect(transferredSolve?.updatedAt).toBeDefined()
    expect(transferredSolve?.updatedAt).toBeGreaterThan(sourceSolve?.updatedAt || 0)

    await page.getByRole('link', { name: 'Solves' }).click()
    await expect(page.getByTestId('main-cube-selector')).toContainText('AnotherCube1')
    await page.locator('html').click()
    await expect(page.getByTestId('solve-grid-item-0')).toBeVisible()
    await expect(page.getByTestId('solve-grid-item-1')).toBeHidden()
  })

  test('should only display as transferable the solves that are "session"', async ({ page }) => {
    await page.getByRole('link', { name: 'Solves' }).click()

    await expect(page.getByTestId('solve-grid-item-0')).toBeVisible()
    await expect(page.getByTestId('solve-grid-item-1')).toBeVisible()

    await page.getByTestId('solve-grid-item-0').click()
    await page.getByTestId('more-actions-button').click()
    await page.getByTestId('move-to-history-button').click()
    await expect(page.getByTestId('solve-grid-item-0')).toBeVisible()
    await expect(page.getByTestId('solve-grid-item-1')).toBeHidden()

    await page.getByRole('link', { name: 'Transfer' }).click()
    await page.getByTestId('source-collection-trigger').click()
    await page.getByTestId('source-collection-AnotherCube1').click()

    const elements = page.locator('[data-testid^="solve-card-"]')
    await expect(elements).toHaveCount(1)
  })

  test('should not transfer solves when none are selected', async ({ page }) => {
    await page.getByTestId('source-collection-trigger').click()
    await page.getByTestId('source-collection-AnotherCube1').click()

    await page.getByTestId('destination-collection-trigger').click()
    await page.getByTestId('destination-collection-AnotherCube2').click()

    await expect(page.getByTestId('transfer-solves-button')).toBeDisabled()
  })

  test('should not list deleted solves as available for transfer', async ({ page }) => {
    await page.getByRole('link', { name: 'Solves' }).click()

    await expect(page.getByTestId('solve-grid-item-0')).toBeVisible()
    await expect(page.getByTestId('solve-grid-item-1')).toBeVisible()

    await page.getByTestId('solve-grid-item-0').click()
    await page.getByTestId('delete-solve-button').click()

    await expect(page.getByTestId('solve-grid-item-0')).toBeVisible()
    await expect(page.getByTestId('solve-grid-item-1')).toBeHidden()

    await page.getByRole('link', { name: 'Transfer' }).click()
    await page.getByTestId('source-collection-trigger').click()
    await page.getByTestId('source-collection-AnotherCube1').click()

    const elements = page.locator('[data-testid^="solve-card-"]')
    await expect(elements).toHaveCount(1)
  })
})
