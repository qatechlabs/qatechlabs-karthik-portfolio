import { expect, routes, test } from "./fixtures";

const viewports = [
  { name: "phone", width: 360, height: 780 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
  { name: "wide", width: 1680, height: 1000 },
];

test.describe("no horizontal overflow", () => {
  test.skip(({ isMobile }) => isMobile, "Viewports are set explicitly");
  for (const viewport of viewports) {
    test(`${viewport.name} (${viewport.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      for (const route of routes) {
        await page.goto(route.path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `${route.path} overflows by ${overflow}px`).toBeLessThanOrEqual(0);
      }
    });
  }
});

test("desktop nav is hidden and menu button shown on small screens", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile only");
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeHidden();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
});

test("animations are disabled when reduced motion is requested", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  const duration = await page
    .getByTestId("confidence-stack")
    .locator("li")
    .first()
    .evaluate((el) => parseFloat(getComputedStyle(el).animationDuration));
  expect(duration).toBeLessThan(0.01);
  await context.close();
});
