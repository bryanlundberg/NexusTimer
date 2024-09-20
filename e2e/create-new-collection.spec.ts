import { test, expect } from "@playwright/test";

test("should create a cube", async ({ page }) => {
  await page.goto("http://localhost:3000/en");
  await expect(page.getByTestId("main-cube-selector")).toBeVisible();
  await page.getByTestId("main-cube-selector").click();
  await expect(
    page.getByRole("button", { name: "New collection" })
  ).toBeVisible();
  await page.getByRole("button", { name: "New collection" }).click();
  await expect(page.getByTestId("empty-cubes-container")).toBeVisible();
  await expect(page.getByTestId("create-collection-button")).toBeVisible();
  await page.getByTestId("create-collection-button").click();
  await expect(page.getByTestId("drawer-create-collection")).toBeVisible();
  await expect(page.getByTestId("drawer-input-name")).toBeVisible();
  await expect(page.getByTestId("drawer-accept-button")).toBeVisible();
  await expect(page.getByTestId("drawer-cancel-button")).toBeVisible();
  await page.getByTestId("drawer-input-name").click();
  await page.getByTestId("drawer-input-name").fill("experimental");
  await page.getByTestId("checkbox-category-3x3").click();
  await page.getByTestId("drawer-accept-button").click();
  await expect(page.getByTestId("cube-name-experimental")).toBeVisible();
});
