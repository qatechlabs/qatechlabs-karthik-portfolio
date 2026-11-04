import { expect, test } from "./fixtures";
import { hero } from "../../src/content/hero";

/** Scrolls to a fraction of the hero's scrubbable range. */
async function scrubTo(page: import("@playwright/test").Page, fraction: number) {
  await page.evaluate((f) => {
    const el = document.querySelector('[data-testid="hero"]') as HTMLElement;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, top + (el.offsetHeight - window.innerHeight) * f + 2);
  }, fraction);
}

test.describe("360° hero", () => {
  test("opens on the first headline with the portrait at frame zero", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("hero")).toHaveAttribute("data-headline", "0");
    await expect(page.getByTestId("hero-headline")).toHaveText(hero.headlines[0].lines.join(""));
    await expect(page.getByTestId("portrait-canvas")).toHaveAttribute("data-frame", "0");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Karthik Kodati");
  });

  test("scrolling scrubs the portrait and moves through the headlines", async ({ page }) => {
    await page.goto("/");
    const last = hero.headlines.length - 1;
    await scrubTo(page, 0.5);
    await expect(page.getByTestId("hero")).toHaveAttribute("data-headline", String(Math.floor(0.5 * hero.headlines.length)));
    const mid = Number(await page.getByTestId("portrait-canvas").getAttribute("data-frame"));
    expect(mid).toBeGreaterThan(0);

    await scrubTo(page, 0.98);
    await expect(page.getByTestId("hero")).toHaveAttribute("data-headline", String(last));
    await expect(page.getByTestId("hero-headline")).toHaveText(hero.headlines[last].lines.join(""), { timeout: 4000 });
    await expect(page.getByTestId("hero-note")).toHaveText(hero.headlines[last].note);
    await expect
      .poll(async () => Number(await page.getByTestId("portrait-canvas").getAttribute("data-frame")))
      .toBeGreaterThan(mid);

    // Scrolling back scrubs in reverse.
    await scrubTo(page, 0);
    await expect(page.getByTestId("hero")).toHaveAttribute("data-headline", "0");
  });

  test("the placeholder is labelled until the portrait frames exist", async ({ page }) => {
    await page.goto("/");
    const placeholder = page.getByTestId("portrait-placeholder");
    if (hero.portrait.frames === 0) await expect(placeholder).toBeVisible();
    else await expect(placeholder).toHaveCount(0);
  });

  test("reduced motion shows a still hero with the first headline", async ({ browser, baseURL }) => {
    const context = await browser.newContext({ reducedMotion: "reduce", baseURL });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByTestId("hero")).toHaveAttribute("data-headline", "0");
    await expect(page.getByTestId("hero-headline")).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(hero.headlines[0].lines[0]);
    await context.close();
  });
});
