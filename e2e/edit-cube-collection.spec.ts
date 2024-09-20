import { test, expect } from "@playwright/test";

test("Should edit the cube collection name", async ({ page }) => {
  await page.goto("http://localhost:3000/en/cubes");
  await expect(page.getByTestId("empty-cubes-container")).toBeVisible();
  await expect(page.getByTestId("create-collection-button")).toBeVisible();
  await page.getByTestId("create-collection-button").click();
  await expect(page.getByTestId("drawer-input-name")).toBeVisible();
  await page.getByTestId("drawer-input-name").click();
  await page.getByTestId("drawer-input-name").fill("test-changing-name");
  await page.getByTestId("checkbox-category-3x3").click();
  await page.getByTestId("drawer-accept-button").click();
  await expect(page.getByTestId("cube-name-test-changing-name")).toBeVisible();
  await page.getByTestId("cube-options").click();
  await page.getByTestId("dropdown-cube-options-edit").click();
  await expect(page.getByTestId("drawer-edit-input-name")).toBeVisible();
  await page.getByTestId("drawer-edit-input-name").click();
  await page.getByTestId("drawer-edit-input-name").fill("my-amazing-cube");
  await page.getByTestId("drawer-edit-accept-button").click();
  await expect(page.getByTestId("cube-name-my-amazing-cube")).toBeVisible();
});
