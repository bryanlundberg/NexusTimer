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
    await solveOnTimer(page, 'TestCube', 0)
    await expect(page.getByTestId('timer-widgets-container')).toBeVisible()
    const data = await getIndexedDBData(page)
    expect(data[0].solves.session.length).toBe(1)
    expect(data[0].solves.all.length).toBe(0)
  })

  test('should add a plus two penalty to the solve (quick-actions-menu)', async ({ page }) => {
    await solveOnTimer(page, 'TestCube', 0)
    await expect(page.getByTestId('quick-action-buttons')).toBeVisible()
    const initialCubes = await getIndexedDBData(page)
    const time = initialCubes[0].solves.session[0].time
    expect(initialCubes[0].solves.session[0].plus2).toBeFalsy()
    expect(initialCubes[0].solves.session[0].dnf).toBeFalsy()
    await page.getByTestId('plus-two-button').click()
    const updatedCubes = await getIndexedDBData(page)
    expect(updatedCubes[0].solves.session[0].plus2).toBeTruthy()
    expect(updatedCubes[0].solves.session[0].time).toBe(time + 2000)
    expect(updatedCubes[0].solves.session[0].dnf).toBeFalsy()
  })

  test('should mark the solve as DNF (quick-actions-menu)', async ({ page }) => {
    await solveOnTimer(page, 'TestCube', 0)
    await expect(page.getByTestId('quick-action-buttons')).toBeVisible()
    const initialCubes = await getIndexedDBData(page)
    const time = initialCubes[0].solves.session[0].time
    expect(initialCubes[0].solves.session[0].dnf).toBeFalsy()
    expect(initialCubes[0].solves.session[0].plus2).toBeFalsy()
    await page.getByTestId('dnf-button').click()
    const updatedCubes = await getIndexedDBData(page)
    expect(updatedCubes[0].solves.session[0].plus2).toBeFalsy()
    expect(updatedCubes[0].solves.session[0].time).toBe(time)
    expect(updatedCubes[0].solves.session[0].dnf).toBeTruthy()
  })

  test('should delete the solve (quick-actions-menu)', async ({ page }) => {
    await solveOnTimer(page, 'TestCube', 0)
    await expect(page.getByTestId('quick-action-buttons')).toBeVisible()
    const initialCubes = await getIndexedDBData(page)
    expect(initialCubes[0].solves.session[0].isDeleted).toBeFalsy()
    await page.getByTestId('delete-solve-button').click()
    const updatedCubes = await getIndexedDBData(page)
    expect(updatedCubes[0].solves.session[0].isDeleted).toBeTruthy()
  })

  test('should bookmark the solve (quick-actions-menu)', async ({ page }) => {
    await solveOnTimer(page, 'TestCube', 0)
    await expect(page.getByTestId('quick-action-buttons')).toBeVisible()
    const initialCubes = await getIndexedDBData(page)
    expect(initialCubes[0].solves.session[0].bookmark).toBeFalsy()
    await page.getByTestId('bookmark-button').click()
    const updatedCubes = await getIndexedDBData(page)
    expect(updatedCubes[0].solves.session[0].bookmark).toBeTruthy()
  })

  test('should toggle DNF and +2 correctly (quick-actions-menu)', async ({ page }) => {
    await solveOnTimer(page, 'TestCube', 0)
    await expect(page.getByTestId('quick-action-buttons')).toBeVisible()
    const initialCubes = await getIndexedDBData(page)
    expect(initialCubes[0].solves.session[0].dnf).toBeFalsy()
    expect(initialCubes[0].solves.session[0].plus2).toBeFalsy()

    // Add +2
    await page.getByTestId('plus-two-button').click()
    const afterPlus2Cubes = await getIndexedDBData(page)
    expect(afterPlus2Cubes[0].solves.session[0].plus2).toBeTruthy()
    expect(afterPlus2Cubes[0].solves.session[0].dnf).toBeFalsy()
    expect(afterPlus2Cubes[0].solves.session[0].time).toBe(initialCubes[0].solves.session[0].time + 2000)

    // Now mark as DNF
    await page.getByTestId('dnf-button').click()
    const afterDNFCubes = await getIndexedDBData(page)
    expect(afterDNFCubes[0].solves.session[0].dnf).toBeTruthy()
    expect(afterDNFCubes[0].solves.session[0].plus2).toBeFalsy()
    expect(afterDNFCubes[0].solves.session[0].time).toBe(initialCubes[0].solves.session[0].time)

    // Mark as +2 again
    await page.getByTestId('plus-two-button').click()
    const finalCubes = await getIndexedDBData(page)
    expect(finalCubes[0].solves.session[0].plus2).toBeTruthy()
    expect(finalCubes[0].solves.session[0].dnf).toBeFalsy()
    expect(finalCubes[0].solves.session[0].time).toBe(initialCubes[0].solves.session[0].time + 2000)
  })
})

test.describe('Timer Manual mode Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await createCube(page, 'ManualCube', '3x3')
    await expect(page.getByTestId('main-cube-selector')).toContainText('Select')
    await page.getByTestId('utilize-cube-button-ManualCube').click()
    await expect(page.getByTestId('main-cube-selector')).toContainText('ManualCube')
    await page.getByTestId('button-select-mode').click()
    await page.getByTestId('mode-manual').click()
    await expect(page.getByTestId('manual-time-input')).toBeVisible()
  })

  test('Should perform a manual solve using the timer', async ({ page }) => {
    await page.getByTestId('manual-time-input').click()

    await page.getByTestId('manual-time-input').fill('1000')
    await page.getByTestId('manual-time-input').press('Enter')

    const data = await getIndexedDBData(page)
    expect(data[0].solves.session.length).toBe(1)
    expect(data[0].solves.session[0].time).toBe(10000)
    expect(data[0].solves.all.length).toBe(0)
  })

  test('should show preview time when typing in manual mode', async ({ page }) => {
    await page.getByTestId('manual-time-input').click()

    await page.getByTestId('manual-time-input').fill('1000')
    await expect(page.getByTestId('preview-time')).toHaveText('10.00')

    await page.getByTestId('manual-time-input').fill('')
    await expect(page.getByTestId('preview-time')).not.toBeVisible()

    await page.getByTestId('manual-time-input').fill('500')
    await expect(page.getByTestId('preview-time')).toHaveText('5.00')

    await page.getByTestId('manual-time-input').fill('196')
    await expect(page.getByTestId('preview-time')).toHaveText('1.96')

    await page.getByTestId('manual-time-input').fill('6856')
    await expect(page.getByTestId('preview-time')).toHaveText('1:08.56')
  })
})
