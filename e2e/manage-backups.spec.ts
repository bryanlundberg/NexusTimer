import { expect, test } from '@playwright/test'
import { createCube } from './utils/create-cube'
import { solveOnTimer } from './utils/solve-on-timer'
import fs from 'fs'
import { Cube } from '@/entities/cube/model/types'

test.describe('should manage import/exports correctly', () => {
  test('should export app data to a file', async ({ page }) => {
    await createCube(page, 'TestCube', '3x3')
    await page.getByTestId('utilize-cube-button-TestCube').click()
    await expect(page.getByTestId('timer-touch-area')).toBeVisible()

    await solveOnTimer(page, 'TestCube', 0)
    await solveOnTimer(page, 'TestCube', 1)

    await page.getByRole('link', { name: 'Solves' }).click()

    await expect(page.getByTestId('solve-grid-item-0')).toBeVisible()
    await expect(page.getByTestId('solve-grid-item-1')).toBeVisible()
    await page.getByTestId('solve-grid-item-0').click()

    await expect(page.getByTestId('solve-details-dialog-content')).toBeVisible()
    await expect(page.getByTestId('delete-solve-button')).toBeVisible()
    await page.getByTestId('delete-solve-button').click()
    await expect(page.getByTestId('solve-details-dialog-content')).toBeHidden()
    await expect(page.getByTestId('solve-grid-item-1')).toBeHidden()

    await page.getByRole('link', { name: 'Settings' }).click()
    const downloadPromise = page.waitForEvent('download')
    await page.getByTestId('export-data-to-file-button').click()

    const download = await downloadPromise

    const path = await download.path()
    console.log(path)
    if (!path) throw new Error('No download path or stream available')
    const content = await fs.promises.readFile(path, 'utf-8')

    const data = JSON.parse(content) as Cube[]
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBe(1)
    expect(data[0].name).toBe('TestCube')
    expect(data[0].solves.all.length).toBe(0)
    expect(data[0].solves.session.length).toBe(2)

    const deletedSolve = data[0].solves.session.findIndex((solve) => solve.isDeleted)
    expect(deletedSolve).not.toBe(-1)
  })

  test('should load backup and merge with existing data', async ({ page, context }) => {})
})
