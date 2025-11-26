import { test } from './fixtures/create-cube-fixture'
import { expect } from '@playwright/test'

test('should create a new cube collection and validate IndexedDB data', async ({ cubeCreated }) => {
  await expect(
    cubeCreated
      .locator('div')
      .filter({ hasText: /^Test cube$/ })
      .first()
  ).toBeVisible()
})
