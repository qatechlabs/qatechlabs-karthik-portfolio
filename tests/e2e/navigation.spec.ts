import { expect, routes, site, test } from "./fixtures";

test.describe("page rendering", () => {
  for (const route of routes) {
    test(`${route.path} renders one h1 and a title`, async ({ page }) => {
      const response = await page.goto(route.path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(route.heading);
      await expect(page).toHaveTitle(new RegExp(site.name));
    });
  }
});

test.describe("primary navigation", () => {
  test("desktop nav reaches every section and marks the current page", async ({ page, isMobile }) => {
    test.skip(isMobile, "Desktop navigation only");
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    for (const item of site.nav) {
      await nav.getByRole("link", { name: item.label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${item.href}$`));
      await expect(nav.getByRole("link", { name: item.label, exact: true })).toHaveAttribute("aria-current", "page");
    }
  });

  test("mobile menu opens, navigates, and closes", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile navigation only");
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Open menu" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    await page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: "Case Studies" }).click();
    await expect(page).toHaveURL(/\/case-studies$/);
    await expect(page.getByRole("navigation", { name: "Mobile" })).toBeHidden();
  });

  test("mobile menu closes with Escape and returns focus", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile navigation only");
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.keyboard.press("Escape");
    const toggle = page.getByRole("button", { name: "Open menu" });
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  test("home link in the header returns to the homepage", async ({ page }) => {
    await page.goto("/about");
    await page.getByRole("link", { name: new RegExp(`^${site.name}.*home$`) }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("skip link is the first focusable element and targets main", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toHaveAttribute("href", "#main");
    await expect(page.locator("main#main")).toHaveCount(1);
  });

  test("unknown routes show the 404 page", async ({ page }) => {
    const response = await page.goto("/does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/doesn.t exist/i);
  });

  test("unknown case study slug returns 404", async ({ page }) => {
    const response = await page.goto("/case-studies/not-a-real-study");
    expect(response?.status()).toBe(404);
  });
});
