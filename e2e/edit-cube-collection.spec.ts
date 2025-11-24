import { test, expect } from '@playwright/test'

test('Should edit a cube name and category validating every change', async ({ page }) => {
  await page.goto('http://localhost:3000/cubes')
  await expect(page.getByRole('heading', { name: 'No cubes for display.' })).toBeVisible()
  await page.getByTestId('create-collection-button').click()
  await page.getByTestId('drawer-input-name').click()
  await page.getByTestId('drawer-input-name').press('CapsLock')
  await page.getByTestId('drawer-input-name').fill('T')
  await page.getByTestId('drawer-input-name').press('CapsLock')
  await page.getByTestId('drawer-input-name').fill('Test')
  await page.getByTestId('checkbox-category-3x3').click()
  await page.getByTestId('drawer-accept-button').click()
  await expect(
    page
      .locator('div')
      .filter({ hasText: /^Test$/ })
      .first()
  ).toBeVisible()
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
  await page.getByRole('button', { name: 'Edit' }).click()
  await page.getByTestId('drawer-edit-select-category').click()
  await page.getByRole('option', { name: 'Pyraminx' }).click()
  await page.getByTestId('drawer-edit-accept-button').click()
  await page.waitForTimeout(500)
  await expect(page.getByText('Pyraminx')).toBeVisible()
})
