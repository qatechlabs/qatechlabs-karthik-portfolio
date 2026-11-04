import { expect, test } from "./fixtures";
import { confidenceStack } from "../../src/content/home";
import { labEntries } from "../../src/content/lab";
import { walkthrough } from "../../src/content/walkthrough";

test.describe("guided walkthrough", () => {
  test("scenes change as the visitor moves through, and diagrams build", async ({ page }) => {
    await page.goto("/");
    const section = page.getByTestId("walkthrough");
    await expect(section).toHaveAttribute("data-scene", walkthrough[0].id);
    await expect(page.getByTestId("walkthrough-narration")).toContainText(walkthrough[0].title);

    const box = await section.boundingBox();
    const viewport = page.viewportSize()!;
    const perScene = (box!.height - viewport.height) / walkthrough.length;

    for (let i = 1; i < walkthrough.length; i++) {
      await page.evaluate((top) => window.scrollTo(0, top), box!.y + perScene * i + 10);
      await expect(section).toHaveAttribute("data-scene", walkthrough[i].id);
      await expect(page.getByTestId("walkthrough-narration")).toContainText(walkthrough[i].title);
      await expect(page.getByTestId("walkthrough-link")).toHaveAttribute("href", walkthrough[i].link!.href);
    }

    // At the end of the last scene the final diagram is fully drawn.
    await page.evaluate((top) => window.scrollTo(0, top), box!.y + box!.height - viewport.height);
    const lastPane = page.locator(`[data-scene-pane="${walkthrough[walkthrough.length - 1].id}"]`);
    const finalLabel = lastPane.getByText("NO MODEL IN THE VERDICT");
    await expect
      .poll(async () => Number(await finalLabel.evaluate((el) => getComputedStyle(el).opacity)), { timeout: 5000 })
      .toBeGreaterThan(0.95);
  });

  test("scene dots jump to a scene and arrow keys step through", async ({ page, isMobile }) => {
    await page.goto("/");
    const section = page.getByTestId("walkthrough");
    await page.getByRole("button", { name: `Scene 3: ${walkthrough[2].kicker}` }).click();
    await expect(section).toHaveAttribute("data-scene", walkthrough[2].id, { timeout: 5000 });

    test.skip(isMobile, "Keyboard stepping on desktop");
    await page.getByRole("group", { name: /Scene 3 of/ }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(section).toHaveAttribute("data-scene", walkthrough[3].id, { timeout: 5000 });
  });

  test("play advances the walkthrough and manual input pauses it", async ({ page }) => {
    await page.goto("/");
    const play = page.getByTestId("walkthrough-play");
    await play.click();
    await expect(play).toHaveAttribute("aria-pressed", "true");
    await expect(play).toHaveText(/Pause/);
    await expect
      .poll(async () => page.getByTestId("walkthrough").getAttribute("data-scene"), { timeout: 15000 })
      .toBe(walkthrough[1].id);
    await page.mouse.wheel(0, 10);
    await expect(play).toHaveAttribute("aria-pressed", "false");
  });

  test("reduced motion shows every scene in sequence with finished diagrams", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    const section = page.getByTestId("walkthrough");
    for (const scene of walkthrough) {
      await expect(section.getByRole("heading", { level: 3, name: scene.title })).toBeVisible();
    }
    await expect(section.getByText("NO MODEL IN THE VERDICT")).toHaveCSS("opacity", "1");
    await context.close();
  });
});

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

test("case study shows reading progress and highlights the current section", async ({ page, isMobile }) => {
  await page.goto("/case-studies/workday-automation-framework");
  await expect(page.getByTestId("reading-progress")).toBeAttached();
  test.skip(isMobile, "Table of contents is desktop-only");
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
