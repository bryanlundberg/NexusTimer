import { test, expect } from "@playwright/test";

test("should navigate to all pages", async ({ page }) => {
  await page.goto("http://localhost:3000/en");
  await expect(page.getByText("Choose a cube to load a")).toBeVisible();
  await expect(page.getByRole("list")).toBeVisible();
  await page.getByRole("link").nth(1).click();
  await page.getByRole("link").nth(2).click();
  await expect(page.getByText("Solves")).toBeVisible();
  await page.getByRole("link").nth(3).click();
  await expect(page.getByText("Stats")).toBeVisible();
  await page.getByRole("link").nth(3).click();
  await expect(page.getByText("Cubes", { exact: true })).toBeVisible();
});
