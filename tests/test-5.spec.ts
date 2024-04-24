import { test, expect } from "@playwright/test";

test.describe("Should check all timer settings", () => {
  test("Should change language", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await expect(page.getByText("Choose a cube to load a")).toBeVisible();
    await page
      .locator("div")
      .filter({ hasText: /^SelectChoose a cube to load a scramble\.$/ })
      .getByRole("link")
      .click();
    await expect(page.getByText("Language")).toBeVisible();
    await page.getByRole("combobox").selectOption("es");
    await expect(page.getByText("Idioma")).toBeVisible();
    await page.getByRole("combobox").selectOption("en");
    await expect(page.getByText("Language")).toBeVisible();
  });

  test("Should hide scramble image", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await expect(page.getByText("Choose a cube to load a")).toBeVisible();

    await expect(page.locator("twisty-player")).toBeVisible();
    await page
      .locator("div")
      .filter({ hasText: /^SelectChoose a cube to load a scramble\.$/ })
      .getByRole("link")
      .click();
    await page.getByRole("switch", { name: "Scramble image" }).click();
    await page.locator(".sm\\:grow").click();
    await expect(page.locator("twisty-player")).toHaveCount(0);

    await page
      .locator("div")
      .filter({ hasText: /^SelectChoose a cube to load a scramble\.$/ })
      .getByRole("link")
      .click();
    await page.getByRole("switch", { name: "Scramble image" }).click();
    await page.locator(".sm\\:grow").click();
    await expect(page.locator("twisty-player")).toBeVisible();
  });

  test("Should toggle display timer stats", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await expect(page.getByText("Choose a cube to load a")).toBeVisible();
    await page
      .locator("div")
      .filter({ hasText: /^SelectChoose a cube to load a scramble\.$/ })
      .getByRole("link")
      .click();
    await page.locator(".sm\\:grow").click();
    await expect(page.getByText("Deviation:")).toBeVisible();
    await expect(page.getByText("Ao5: --")).toBeVisible();
    await page
      .locator("div")
      .filter({ hasText: /^SelectChoose a cube to load a scramble\.$/ })
      .getByRole("link")
      .click();
    await page.getByRole("switch", { name: "Session stats" }).click();
    await page.locator(".sm\\:grow").click();
    await expect(page.getByText("Deviation:")).toHaveCount(0);
    await expect(page.getByText("Ao5: --")).toHaveCount(0);
  });

  test("Should toggle manual mode", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await expect(page.getByText("Choose a cube to load a")).toBeVisible();
    await page
      .locator("div")
      .filter({ hasText: /^SelectChoose a cube to load a scramble\.$/ })
      .getByRole("link")
      .click();
    await page.getByRole("switch", { name: "Manual mode" }).click();
    await page.locator(".sm\\:grow").click();
    await expect(page.getByPlaceholder("...")).toBeVisible();
    await page
      .locator("div")
      .filter({ hasText: /^SelectChoose a cube to load a scramble\.$/ })
      .getByRole("link")
      .click();
    await page.getByRole("switch", { name: "Manual mode" }).click();
    await page.locator(".sm\\:grow").click();
    await expect(page.getByPlaceholder("...")).toHaveCount(0);
  });
});
