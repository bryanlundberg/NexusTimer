import { test } from './fixtures/create-cube-fixture'
import { solveOnTimer } from './utils/solve-on-timer'
import { expect } from '@playwright/test'
import { getIndexedDBData } from './utils/indexdb-helpers'

test.beforeEach(async ({ cubeCreated }) => {
  await expect(cubeCreated.getByRole('button', { name: 'Utilize' })).toBeVisible()
  await cubeCreated.getByRole('button', { name: 'Utilize' }).click()
  await expect(cubeCreated.locator('#touch').first()).toBeVisible()

  await solveOnTimer(cubeCreated, 0, 0)
  await solveOnTimer(cubeCreated, 0, 1)

  await expect(cubeCreated.getByTestId('timer-session-count')).toBeVisible()
  await cubeCreated.getByRole('link', { name: 'Solves' }).click()
})

test.describe('Manage solves in a cube collection in the solves page', () => {
  test('should do 2 solves and display 2 solves on grid', async ({ cubeCreated }) => {
    await expect(cubeCreated.getByTestId('solve-grid-item-0')).toBeVisible()
    await expect(cubeCreated.getByTestId('solve-grid-item-1')).toBeVisible()
    await expect(cubeCreated.getByTestId('solve-grid-item-2')).toBeHidden()

    const cubes = await getIndexedDBData(cubeCreated)

    expect(cubes[0].solves.session.length).toBe(2)
    expect(cubes[0].solves.all.length).toBe(0)
  })

  test('should do 2 solves, delete one, and display 1 solve', async ({ cubeCreated }) => {
    await expect(cubeCreated.getByTestId('solve-grid-item-0')).toBeVisible()
    await cubeCreated.getByTestId('solve-grid-item-0').click()

    await expect(cubeCreated.getByTestId('solve-details-dialog-content')).toBeVisible()
    await expect(cubeCreated.getByTestId('delete-solve-button')).toBeVisible()
    await cubeCreated.getByTestId('delete-solve-button').click()
    await expect(cubeCreated.getByTestId('solve-details-dialog-content')).toBeHidden()
    await expect(cubeCreated.getByTestId('solve-grid-item-1')).toBeHidden()

    const cubes = await getIndexedDBData(cubeCreated)

    expect(cubes[0].solves.session.length).toBe(2)
    expect(cubes[0].solves.all.length).toBe(0)

    expect(cubes[0].solves.session[0].isDeleted).toBe(true)
  })
})
