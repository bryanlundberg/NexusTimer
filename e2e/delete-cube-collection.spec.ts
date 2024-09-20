import { test, expect } from "@playwright/test";

test("Should be able to delete a cube collection", async ({ page }) => {
  await page.goto("http://localhost:3000/en/cubes");
  await expect(page.getByTestId("empty-cubes-container")).toBeVisible();
  await expect(page.getByTestId("create-collection-button")).toBeVisible();
  await page.getByTestId("create-collection-button").click();
  await page.getByTestId("drawer-input-name").click();
  await page.getByTestId("drawer-input-name").fill("fake-cube-name");
  await page.getByTestId("checkbox-category-6x6").click();
  await page.getByTestId("drawer-accept-button").click();
  await expect(page.getByTestId("cube-name-fake-cube-name")).toBeVisible();
  await expect(page.getByTestId("cube-options")).toBeVisible();
  await page.getByTestId("cube-options").click();
  await expect(page.getByTestId("dropdown-cube-options-delete")).toBeVisible();
  await page.getByTestId("dropdown-cube-options-delete").click();
  await expect(page.getByTestId("dialog-delete-cube-container")).toBeVisible();
  await expect(page.getByTestId("dialog-delete-cube-title")).toBeVisible();
  await expect(
    page.getByTestId("dialog-delete-cube-description")
  ).toBeVisible();
  await expect(page.getByTestId("dialog-delete-cube-warning")).toBeVisible();
  await expect(page.getByTestId("dialog-delete-cube-input")).toBeVisible();
  await expect(
    page.getByTestId("dialog-delete-cube-cancel-button")
  ).toBeVisible();
  await expect(
    page.getByTestId("dialog-delete-cube-accept-button")
  ).toBeVisible();
  await page.getByTestId("dialog-delete-cube-input").click();
  await page.getByTestId("dialog-delete-cube-input").fill("asd");
  await page.getByTestId("dialog-delete-cube-accept-button").click();
  await expect(
    page.getByTestId("dialog-delete-cube-error-message")
  ).toBeVisible();
  await page.getByTestId("dialog-delete-cube-input").click();
  await page.getByTestId("dialog-delete-cube-input").fill("fake-cube-name");
  await page.getByTestId("dialog-delete-cube-accept-button").click();
  await expect(page.getByTestId("empty-cubes-container")).toBeVisible();
});
