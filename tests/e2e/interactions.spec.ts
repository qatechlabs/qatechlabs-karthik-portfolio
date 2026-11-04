import { expect, test } from "./fixtures";
import { confidenceStack } from "../../src/content/home";
import { labEntries } from "../../src/content/lab";

test.describe("interactive confidence stack", () => {
  test("selecting a layer shows its tools and case study link", async ({ page }) => {
    await page.goto("/");
    const detail = page.getByRole("region", { name: "Selected layer" });
    const target = confidenceStack.find((layer) => layer.id === "events")!;
    await page.getByRole("button", { name: new RegExp(target.name) }).click();
    await expect(page.getByRole("button", { name: new RegExp(target.name) })).toHaveAttribute("aria-pressed", "true");
    await expect(detail).toContainText(target.tools[0]);
    await expect(detail.getByRole("link")).toHaveAttribute("href", `/case-studies/${target.caseStudy}`);
  });

  test("arrow keys move between layers", async ({ page, isMobile }) => {
    test.skip(isMobile, "Keyboard interaction on desktop");
    await page.goto("/");
    const first = page.getByRole("button", { name: new RegExp(confidenceStack[0].name) });
    await first.focus();
    await page.keyboard.press("ArrowDown");
    const second = page.getByRole("button", { name: new RegExp(confidenceStack[1].name) });
    await expect(second).toBeFocused();
    await expect(second).toHaveAttribute("aria-pressed", "true");
  });
});

test("stats count up to their real values", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("heading", { name: "Scale of work" }).scrollIntoViewIfNeeded();
  await expect(page.getByText("40%", { exact: true })).toBeVisible({ timeout: 5000 });
  await expect(page.getByText("9+", { exact: true })).toBeVisible();
});

test("lab filter shows only entries with the chosen status", async ({ page }) => {
  await page.goto("/lab");
  const entries = page.getByTestId("lab-entry");
  await expect(entries).toHaveCount(labEntries.length);
  const exploration = labEntries.filter((entry) => entry.status === "exploration").length;
  await page.getByRole("button", { name: /^Exploration/ }).click();
  await expect(page.getByRole("button", { name: /^Exploration/ })).toHaveAttribute("aria-pressed", "true");
  await expect(entries).toHaveCount(exploration);
  await page.getByRole("button", { name: /^All/ }).click();
  await expect(entries).toHaveCount(labEntries.length);
});

test("header hides on scroll down and returns on scroll up", async ({ page }) => {
  await page.goto("/");
  const header = page.locator("header").first();
  await page.mouse.wheel(0, 1200);
  await expect(header).toHaveAttribute("data-hidden", "true");
  await page.mouse.wheel(0, -400);
  await expect(header).not.toHaveAttribute("data-hidden", "true");
});

test("case study shows reading progress and highlights the current section", async ({ page, isMobile }) => {
  await page.goto("/case-studies/workday-automation-framework");
  await expect(page.getByTestId("reading-progress")).toBeAttached();
  test.skip(isMobile, "Table of contents is desktop-only");
  // Scroll until the "Key decisions" heading has passed the reading line (30% down the viewport).
  await page.evaluate(() => {
    const el = document.getElementById("decisions")!;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.2 });
  });
  const toc = page.getByRole("navigation", { name: "On this page" });
  await expect(toc.getByRole("link", { name: /Key decisions/ })).toHaveAttribute("aria-current", "location");
});

test("architecture pipeline lights up when scrolled into view", async ({ page }) => {
  await page.goto("/case-studies/workday-automation-framework");
  const pipeline = page.getByTestId("pipeline");
  await pipeline.scrollIntoViewIfNeeded();
  await expect(pipeline.locator("> li").first()).toHaveClass(/border-rose-500/, { timeout: 5000 });
});
