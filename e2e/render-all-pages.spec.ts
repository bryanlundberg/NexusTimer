import { test, expect } from "@playwright/test";

test("should navigate to all pages", async ({ page }) => {
  await page.goto("http://localhost:3000/en");
  await expect(page.getByTestId("scramble-text-zone")).toBeVisible();
  await page.getByTestId("nav/solves").click();
  await expect(page.getByTestId("page-title-solves")).toBeVisible();
  await page.getByTestId("nav/stats").click();
  await expect(page.getByTestId("page-title-stats")).toBeVisible();
  await page.getByTestId("nav/cubes").click();
  await expect(page.getByTestId("page-title-cubes")).toBeVisible();
});
