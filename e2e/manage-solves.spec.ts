import { solveOnTimer } from './utils/solve-on-timer'
import { expect, test } from '@playwright/test'
import { getIndexedDBData } from './utils/indexdb-helpers'
import { createCube } from './utils/create-cube'

test.describe('Manage solves for a cube collection on the Solves page', () => {
  test.beforeEach(async ({ page }) => {
    await createCube(page, 'TestCube', '3x3')
    await expect(page.getByRole('button', { name: 'Utilize' })).toBeVisible()
    await page.getByRole('button', { name: 'Utilize' }).click()
    await expect(page.locator('#touch').first()).toBeVisible()

    await solveOnTimer(page, 0, 0)
    await solveOnTimer(page, 0, 1)

    await expect(page.getByTestId('timer-session-count')).toBeVisible()
    await page.getByRole('link', { name: 'Solves' }).click()
  })

  test('Should add 2 solves and show both in the grid', async ({ page }) => {
    await expect(page.getByTestId('solve-grid-item-0')).toBeVisible()
    await expect(page.getByTestId('solve-grid-item-1')).toBeVisible()
    await expect(page.getByTestId('solve-grid-item-2')).toBeHidden()

    const cubes = await getIndexedDBData(page)

    expect(cubes[0].solves.session.length).toBe(2)
    expect(cubes[0].solves.all.length).toBe(0)
  })

  test('Should delete 1 of 2 solves and show only 1 in the grid', async ({ page }) => {
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

  test('Should mark 1 of 2 solves as DNF and show correct status/icons', async ({ page }) => {
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

    await page.mouse.click(10, 10)
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
})
