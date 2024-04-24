import { test, expect } from "@playwright/test";

test("should create a cube from home-page", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.getByRole("button", { name: "Select" }).click();
  await expect(page.getByText("Favorites")).toBeVisible();
  await page.getByRole("link", { name: "Add cube" }).click();
  await page.getByPlaceholder("Brand | Model | Version |").click();
  await page.getByPlaceholder("Brand | Model | Version |").fill("test");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByText("test")).toBeVisible();
});
