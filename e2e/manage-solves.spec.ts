import { solveOnTimer } from './utils/solve-on-timer'
import { expect, test } from '@playwright/test'
import { getIndexedDBData } from './utils/indexdb-helpers'
import { createCube } from './utils/create-cube'

test.describe('Manage solves for a cube collection on the Solves page', () => {
  test.beforeEach(async ({ page }) => {
    await createCube(page, 'TestCube', '3x3')
    await page.getByTestId('utilize-cube-button-TestCube').click()
    await expect(page.getByTestId('timer-touch-area')).toBeVisible()

    await solveOnTimer(page, 0, 0)
    await solveOnTimer(page, 0, 1)

    await expect(page.getByTestId('timer-session-count')).toBeVisible()
    await page.getByRole('link', { name: 'Solves' }).click()
  })

  test('Should add 2 solves and show correct status/icons', async ({ page }) => {
    await expect(page.getByTestId('solve-grid-item-0')).toBeVisible()
    await expect(page.getByTestId('solve-grid-item-1')).toBeVisible()
    await expect(page.getByTestId('solve-grid-item-2')).toBeHidden()

    const cubes = await getIndexedDBData(page)

    expect(cubes[0].solves.session.length).toBe(2)
    expect(cubes[0].solves.all.length).toBe(0)
  })

  test('Should delete a solve and show only 1 in the grid', async ({ page }) => {
    await expect(page.getByTestId('solve-grid-item-0')).toBeVisible()
    await page.getByTestId('solve-grid-item-0').click()

    await expect(page.getByTestId('solve-details-dialog-content')).toBeVisible()
    await expect(page.getByTestId('delete-solve-button')).toBeVisible()
    await page.getByTestId('delete-solve-button').click()
    await expect(page.getByTestId('solve-details-dialog-content')).toBeHidden()
    await expect(page.getByTestId('solve-grid-item-1')).toBeHidden()

    const cubes = await getIndexedDBData(page)

    expect(cubes[0].solves.session.length).toBe(2)
    expect(cubes[0].solves.all.length).toBe(0)

    expect(cubes[0].solves.session[0].isDeleted).toBe(true)
  })

  test('Should mark a solve as DNF and show correct status/icons', async ({ page }) => {
    await expect(page.getByTestId('solve-grid-item-0')).toBeVisible()
    await page.getByTestId('solve-grid-item-0').click()

    await expect(page.getByTestId('solve-details-dialog-content')).toBeVisible()

    const initialCubes = await getIndexedDBData(page)

    expect(initialCubes[0].solves.session.length).toBe(2)

    const cubeTime = initialCubes[0].solves.session[0].time
    const cubeEndTime = initialCubes[0].solves.session[0].endTime
    const cubeIsDnf = initialCubes[0].solves.session[0].dnf

    expect(cubeIsDnf).toBeFalsy()

    await expect(page.getByTestId('dnf-button')).toBeVisible()
    await page.getByTestId('dnf-button').click()

    await page.locator('body').press('Escape')
    await expect(page.getByTestId('solve-details-dialog-content')).toBeHidden()

    await expect(page.getByTestId('dnf-icon-0')).toBeVisible()
    await expect(page.getByTestId('plus-two-icon-0')).toBeHidden()
    await expect(page.getByTestId('comment-icon-0')).toBeHidden()
    await expect(page.getByTestId('bookmark-icon-0')).toBeHidden()
    await expect(page.getByTestId('solve-grid-item-1')).toBeVisible()

    const afterCubes = await getIndexedDBData(page)

    expect(afterCubes[0].solves.session.length).toBe(2)
    expect(afterCubes[0].solves.all.length).toBe(0)

    expect(afterCubes[0].solves.session[0].dnf).toBe(true)
    expect(afterCubes[0].solves.session[0].time).toBe(cubeTime)
    expect(afterCubes[0].solves.session[0].endTime).toBe(cubeEndTime)
    expect(afterCubes[0].solves.session[0].dnf).toBeTruthy()

    await expect(page.getByTestId('dnf-icon-0')).toBeVisible()
  })

  test('Should mark a solve with +2 seconds and show correct status/icons', async ({ page }) => {
    const initialCubes = await getIndexedDBData(page)

    await expect(page.getByTestId('solve-grid-item-0')).toBeVisible()
    await page.getByTestId('solve-grid-item-0').click()

    await expect(page.getByTestId('solve-details-dialog-content')).toBeVisible()
    await page.getByTestId('plus-two-button').click()

    const afterCubes = await getIndexedDBData(page)

    expect(initialCubes[0].solves.session.length).toBe(2)
    expect(afterCubes[0].solves.session.length).toBe(2)
    expect(afterCubes[0].solves.all.length).toBe(0)

    expect(afterCubes[0].solves.session[0].plus2).toBe(true)
    expect(afterCubes[0].solves.session[0].time).toBe(initialCubes[0].solves.session[0].time + 2000)
    expect(afterCubes[0].solves.session[0].endTime).toBe(initialCubes[0].solves.session[0].endTime)
    expect(afterCubes[0].solves.session[0].updatedAt).toBeGreaterThan(initialCubes[0].solves.session[0].updatedAt || 0)

    await page.locator('body').press('Escape')
    await expect(page.getByTestId('solve-details-dialog-content')).toBeHidden()

    await expect(page.getByTestId('plus-two-icon-0')).toBeVisible()
  })

  test('Should bookmark a solve and show correct status/icons', async ({ page }) => {
    const initialCubes = await getIndexedDBData(page)

    await expect(page.getByTestId('solve-grid-item-0')).toBeVisible()
    await page.getByTestId('solve-grid-item-0').click()
    await expect(page.getByTestId('solve-details-dialog-content')).toBeVisible()

    expect(initialCubes[0].solves.session.length).toBe(2)

    await page.getByTestId('bookmark-button').click()

    const afterCubes = await getIndexedDBData(page)

    expect(afterCubes[0].solves.session.length).toBe(2)
    expect(afterCubes[0].solves.all.length).toBe(0)

    expect(afterCubes[0].solves.session[0].bookmark).toBeTruthy()
    expect(afterCubes[0].solves.session[0].updatedAt).toBeGreaterThan(initialCubes[0].solves.session[0].updatedAt || 0)

    await page.locator('body').press('Escape')
    await expect(page.getByTestId('solve-details-dialog-content')).toBeHidden()
    await expect(page.getByTestId('bookmark-icon-0')).toBeVisible()
  })

  test('Should click transfer solve option', async ({ page }) => {
    await expect(page.getByTestId('solve-grid-item-0')).toBeVisible()
    await page.getByTestId('solve-grid-item-0').click()
    await expect(page.getByTestId('solve-details-dialog-content')).toBeVisible()

    await page.getByTestId('more-actions-button').click()
    await page.getByTestId('transfer-collection-button').click()

    await expect(page).toHaveURL(/.*transfer-solves\?source-collection=.*/)
    await expect(page.getByTestId('solve-details-dialog-content')).toBeHidden()

    await expect(page.getByTestId('source-collection-trigger')).not.toContainText('Collection Origin')
    await expect(page.getByTestId('destination-collection-trigger')).toContainText('Collection Destination')
  })

  test('Should copy a solve and show correct status/icons', async ({ page }) => {
    const browserName = page.context().browser()?.browserType().name() || ''

    test.skip(
      browserName !== 'chromium',
      'Playwright permissions only supported for Chromiun browser, more details refer to: https://github.com/microsoft/playwright/issues/13037.'
    )

    await expect(page.getByTestId('solve-grid-item-0')).toBeVisible()
    await page.getByTestId('solve-grid-item-0').click()
    await expect(page.getByTestId('solve-details-dialog-content')).toBeVisible()

    await page.getByTestId('more-actions-button').click()
    await page.getByTestId('copy-solve-button').click()

    const context = page.context()
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipboardText).toBeDefined()
  })
})

// await page.getByTestId('button-display-type').click();
// await expect(page.getByTestId('empty-solves-grid')).toBeVisible();
