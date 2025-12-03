import { expect, Page } from '@playwright/test'
import { getIndexedDBData } from './indexdb-helpers'

export async function solveOnTimer(page: Page, cubeIndex: number, solveIndex: number) {
  await expect(page.getByTestId('scramble-text-zone')).toBeVisible()
  await page.keyboard.down('Space')
  await expect(page.getByTestId('scramble-text-zone')).toBeHidden()
  await page.keyboard.up('Space')

  await page.waitForTimeout(1000)
  await page.keyboard.press('Space')
  await expect(page.getByTestId('scramble-text-zone')).toBeVisible()

  await expect(async () => {
    const cubes = await getIndexedDBData(page)

    expect(cubes[cubeIndex].solves.all.length).toBe(0)
    expect(cubes[cubeIndex].solves.session[solveIndex].time).toBeGreaterThan(0)
    expect(cubes[cubeIndex].solves.session[solveIndex].scramble).toBeDefined()
    expect(cubes[cubeIndex].solves.session[solveIndex].id).toBeDefined()
    expect(cubes[cubeIndex].solves.session[solveIndex].cubeId).toBeDefined()
    expect(cubes[cubeIndex].solves.session[solveIndex].startTime).toBeDefined()
    expect(cubes[cubeIndex].solves.session[solveIndex].endTime).toBeDefined()
    expect(cubes[cubeIndex].solves.session[solveIndex].updatedAt).toBeDefined()
    expect(cubes[cubeIndex].solves.session[solveIndex].isDeleted).toBe(false)
    expect(cubes[cubeIndex].solves.session[solveIndex].dnf).toBe(false)
    expect(cubes[cubeIndex].solves.session[solveIndex].plus2).toBe(false)
    expect(cubes[cubeIndex].solves.session[solveIndex].rating).toBeGreaterThan(0)
  }).toPass()
}
