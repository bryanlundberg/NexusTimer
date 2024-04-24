import { test, expect } from "@playwright/test";

test("Should create and delete a cube", async ({ page }) => {
  await page.goto("http://localhost:3000/cubes");
  await page.getByRole("button").click();
  await page.getByPlaceholder("Brand | Model | Version |").click();
  await page.getByPlaceholder("Brand | Model | Version |").fill("test");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByText("test")).toBeVisible();
  await page.getByRole("button").nth(2).click();
  await page.getByRole("button", { name: "Delete" }).click();
  await page.getByRole("button", { name: "Confirm" }).click();
  await expect(page.getByText("No cubes for display.")).toBeVisible();
});
