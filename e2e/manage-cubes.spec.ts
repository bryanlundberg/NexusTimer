import { expect, test } from '@playwright/test'
import { getIndexedDBData } from './utils/indexdb-helpers'
import { createCube } from './utils/create-cube'

test.describe('Manage cube collections on the Cubes page', () => {
  test('Should validate create cube form', async ({ page }) => {
    await page.goto('/cubes')
    await expect(page.getByRole('heading', { name: 'No cubes for display.' })).toBeVisible()
    await page.getByTestId('empty-cubes-container').getByRole('button', { name: 'New collection' }).click()
    await page.getByTestId('drawer-input-name').click()
    await page.getByTestId('drawer-input-name').fill('TestCube')
    await expect(page.getByTestId('checkbox-category-2x2')).toBeVisible()
    await expect(page.getByTestId('checkbox-category-3x3')).toBeVisible()
    await expect(page.getByTestId('checkbox-category-3x3 OH')).toBeVisible()
    await expect(page.getByTestId('checkbox-category-4x4')).toBeVisible()
    await expect(page.getByTestId('checkbox-category-5x5')).toBeVisible()
    await expect(page.getByTestId('checkbox-category-6x6')).toBeVisible()
    await expect(page.getByTestId('checkbox-category-7x7')).toBeVisible()
    await expect(page.getByTestId('checkbox-category-SQ1')).toBeVisible()
    await expect(page.getByTestId('checkbox-category-Skewb')).toBeVisible()
    await expect(page.getByTestId('checkbox-category-Pyraminx')).toBeVisible()
    await expect(page.getByTestId('checkbox-category-Megaminx')).toBeVisible()
    await expect(page.getByTestId('checkbox-category-Clock')).toBeVisible()
    await page.getByTestId('checkbox-category-4x4').click()
    await expect(page.getByText('Current selection: 4x4')).toBeVisible()
    await page.getByTestId('checkbox-category-SQ1').click()
    await expect(page.getByText('Current selection: SQ1')).toBeVisible()
    await page.getByTestId('checkbox-category-Clock').click()
    await expect(page.getByText('Current selection: Clock')).toBeVisible()
    await expect(page.getByTestId('drawer-accept-button')).toBeVisible()
    await page.getByTestId('drawer-accept-button').click()
    await expect(
      page
        .locator('div')
        .filter({ hasText: /^TestCube$/ })
        .first()
    ).toBeVisible()

    await page.waitForTimeout(500)
    const data = await getIndexedDBData(page)

    expect(data.length).toBe(1)
    expect(data[0].name).toBe('TestCube')
    expect(data[0].category).toBe('Clock')
    expect(data[0].solves.session.length).toBe(0)
    expect(data[0].solves.all.length).toBe(0)
    expect(data[0].isDeleted).toBeFalsy()
    expect(data[0].createdAt).toBeDefined()
    expect(data[0].updatedAt).toBeDefined()
    expect(data[0].id).toBeDefined()
  })

  test('Should edit a cube collection', async ({ page }) => {
    await createCube(page, 'TestCube', 'Clock')
    await expect(
      page
        .locator('div')
        .filter({ hasText: /^TestCube$/ })
        .first()
    ).toBeVisible()

    const data = await getIndexedDBData(page)

    expect(data.length).toBe(1)
    expect(data[0].name).toBe('TestCube')
    expect(data[0].category).toBe('Clock')

    await page.getByRole('button', { name: 'Edit' }).click()
    await expect(page.getByText('Modifying the collection')).toBeVisible()
    await page.getByTestId('drawer-edit-input-name').click()
    await page.getByTestId('drawer-edit-input-name').fill('Test2')
    await page.getByTestId('drawer-edit-accept-button').click()
    await expect(
      page
        .locator('div')
        .filter({ hasText: /^Test2$/ })
        .first()
    ).toBeVisible()

    const dataAfterEdit1 = await getIndexedDBData(page)
    expect(dataAfterEdit1.length).toBe(1)
    expect(dataAfterEdit1[0].name).toBe('Test2')
    expect(dataAfterEdit1[0].category).toBe('Clock')

    await page.getByRole('button', { name: 'Edit' }).click()
    await page.getByTestId('drawer-edit-select-category').click()
    await page.getByRole('option', { name: 'Pyraminx' }).click()
    await page.getByTestId('drawer-edit-accept-button').click()
    await page.waitForTimeout(500)
    await expect(page.getByText('Pyraminx')).toBeVisible()

    const dataAfterEdit2 = await getIndexedDBData(page)
    expect(dataAfterEdit2.length).toBe(1)
    expect(dataAfterEdit2[0].name).toBe('Test2')
    expect(dataAfterEdit2[0].category).toBe('Pyraminx')
  })

  test('Should delete a cube collection', async ({ page }) => {
    await createCube(page, 'TestCube', 'Clock')
    await expect(
      page
        .locator('div')
        .filter({ hasText: /^TestCube$/ })
        .first()
    ).toBeVisible()
    await page.getByRole('button', { name: 'Delete' }).click()
    await expect(page.getByTestId('dialog-delete-cube-description')).toBeVisible()
    await page.getByTestId('dialog-delete-cube-input').click()
    await page.getByTestId('dialog-delete-cube-input').fill('asd')
    await page.getByTestId('dialog-delete-cube-accept-button').click()
    await expect(page.getByTestId('dialog-delete-cube-error-message')).toBeVisible()
    await page.getByTestId('dialog-delete-cube-input').click()
    await page.getByTestId('dialog-delete-cube-input').fill('')
    await page.getByTestId('dialog-delete-cube-input').press('CapsLock')
    await page.getByTestId('dialog-delete-cube-input').fill('T')
    await page.getByTestId('dialog-delete-cube-input').press('CapsLock')
    await page.getByTestId('dialog-delete-cube-input').fill('Test')
    await page.getByTestId('dialog-delete-cube-input').press('CapsLock')
    await page.getByTestId('dialog-delete-cube-input').fill('TestC')
    await page.getByTestId('dialog-delete-cube-input').press('CapsLock')
    await page.getByTestId('dialog-delete-cube-input').fill('TestCube')
    await page.getByTestId('dialog-delete-cube-accept-button').click()
    await expect(page.getByText('Collection deleted')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'No cubes for display.' })).toBeVisible()

    const data = await getIndexedDBData(page)

    expect(data.length).toBe(1)
    expect(data[0].name).toBe('TestCube')
    expect(data[0].isDeleted).toBeTruthy()
  })
})
