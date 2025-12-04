import { expect, Page } from '@playwright/test'
import { getIndexedDBData } from './indexdb-helpers'

export async function solveOnTimer(page: Page, cubeIndex: number, solveIndex: number) {
  // Ensure timer is idle and scramble is visible before starting
  await expect(page.getByTestId('scramble-text-zone')).toBeVisible({ timeout: 10000 })

  // Hold Space to arm/start and wait until scramble hides (timer running)
  await page.keyboard.down('Space')
  await expect(page.getByTestId('scramble-text-zone')).toBeHidden({ timeout: 10000 })
  // Release to actually start
  await page.keyboard.up('Space')

  // Press Space to stop the timer
  // Add a tiny delay to avoid missing key events on low FPS environments
  await page.waitForTimeout(100)
  await page.keyboard.press('Space')

  await expect(page.getByTestId('scramble-text-zone')).toBeVisible({ timeout: 15000 })

  await expect(async () => {
    const cubes = await getIndexedDBData(page)

    const target = cubes?.[cubeIndex]?.solves?.session?.[solveIndex]

    expect(target).toBeDefined()
    expect(target.time).toBeGreaterThan(0)
    expect(target.scramble).toBeDefined()
    expect(target.id).toBeDefined()
    expect(target.cubeId).toBeDefined()
    expect(target.startTime).toBeDefined()
    expect(target.endTime).toBeDefined()
    expect(target.updatedAt).toBeDefined()
    expect(target.isDeleted).toBe(false)
    expect(target.dnf).toBe(false)
    expect(target.plus2).toBe(false)
    expect(target.rating).toBeGreaterThan(0)
  }).toPass()
}
