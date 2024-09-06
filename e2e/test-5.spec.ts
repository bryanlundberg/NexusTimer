import { test, expect } from "@playwright/test";

test.describe("Should try all settings", () => {
  test("Should change language", async ({ page }) => {
    await page.goto("http://localhost:3000/en");
    await expect(page.getByText("Choose a cube to load a")).toBeVisible();
    await page
      .locator("div")
      .filter({ hasText: /^SelectChoose a cube to load a scramble\.$/ })
      .getByRole("link")
      .click();
    await expect(page.getByText("Language")).toBeVisible();
    await page.getByRole("button", { name: "English" }).click();
    await expect(page.getByText("Español")).toBeVisible();
    await expect(page.getByText("Français")).toBeVisible();
    await expect(page.getByText("Deutsch")).toBeVisible();
    await expect(page.getByText("中文")).toBeVisible();
    await page.getByText("Español").click();
    await page.getByText("Elige un cubo para cargar una");
  });

  // add more stuff...
});
