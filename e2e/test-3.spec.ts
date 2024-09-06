import { test, expect } from "@playwright/test";

test("Should create a cube from cubes-page", async ({ page }) => {
  await page.goto("http://localhost:3000/en/cubes");
  await expect(page.getByText("Cubes", { exact: true })).toBeVisible();
  await page.getByRole("button").click();
  await page.getByPlaceholder("Brand | Model | Version |").fill("test");
  await page.getByRole("img", { name: "3x3", exact: true }).click();
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByText("test")).toBeVisible();
});
