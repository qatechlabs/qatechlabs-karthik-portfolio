import { expect, test } from "./fixtures";
import { confidenceStack } from "../../src/content/home";
import { guide } from "../../src/content/guide";
import { walkthrough } from "../../src/content/walkthrough";

/**
 * Headless Chromium has speech synthesis but no voices, so `onend` may never
 * fire. Stub it with an engine that ends each utterance after a short delay,
 * which also keeps the tests fast and deterministic.
 */
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    class FakeUtterance {
      text: string;
      voice: unknown = null;
      rate = 1;
      pitch = 1;
      onend: (() => void) | null = null;
      onerror: (() => void) | null = null;
      constructor(text: string) {
        this.text = text;
      }
    }
    const spoken: string[] = [];
    const synth = {
      spoken,
      speaking: false,
      getVoices: () => [],
      cancel: () => undefined,
      speak: (u: FakeUtterance) => {
        spoken.push(u.text);
        setTimeout(() => u.onend?.(), 1500);
      },
    };
    Object.defineProperty(window, "speechSynthesis", { value: synth, configurable: true });
    Object.defineProperty(window, "SpeechSynthesisUtterance", { value: FakeUtterance, configurable: true });
  });
});

test.describe("confidence stack executes in order", () => {
  test("layers activate L01 to L06 and then hand control to the visitor", async ({ page }) => {
    await page.goto("/");
    const stack = page.getByTestId("confidence-stack");
    const figure = stack.locator("xpath=ancestor::figure");
    await figure.scrollIntoViewIfNeeded();
    await expect(figure).toHaveAttribute("data-sequencing", "true");

    const order = [...confidenceStack].reverse(); // L01 first
    for (const layer of order) {
      await expect(stack.getByRole("button", { name: new RegExp(layer.name) })).toHaveAttribute("aria-pressed", "true", { timeout: 4000 });
    }
    await expect(figure).not.toHaveAttribute("data-sequencing", "true", { timeout: 4000 });
    await expect(page.getByTestId("stack-replay")).toBeVisible();
  });

  test("replay restarts from L01", async ({ page }) => {
    await page.goto("/");
    const stack = page.getByTestId("confidence-stack");
    await stack.scrollIntoViewIfNeeded();
    await expect(page.getByTestId("stack-replay")).toBeVisible({ timeout: 12000 });
    await page.getByTestId("stack-replay").click();
    const first = [...confidenceStack].reverse()[0];
    await expect(stack.getByRole("button", { name: new RegExp(first.name) })).toHaveAttribute("aria-pressed", "true", { timeout: 3000 });
  });

  test("reduced motion shows the stack complete, no sequence", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    const figure = page.getByTestId("confidence-stack").locator("xpath=ancestor::figure");
    await expect(figure).not.toHaveAttribute("data-sequencing", "true");
    await expect(page.getByTestId("stack-replay")).toBeVisible();
    await context.close();
  });
});

test.describe("spoken guide", () => {
  test("hero button opens the guide and speaks the introduction with captions", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("cta-intro").click();
    await expect(page.getByTestId("guide-panel")).toBeVisible();
    await expect(page.getByTestId("guide-caption")).toHaveText(guide.intro[0].text);
    await expect(page.getByTestId("guide-character")).toHaveAttribute("data-speaking", "true");
    await expect(page.getByTestId("guide-caption")).toHaveText(guide.intro[1].text, { timeout: 4000 });
    await page.getByTestId("guide-stop").click();
    await expect(page.getByTestId("guide-character")).not.toHaveAttribute("data-speaking", "true");
    const spoken = await page.evaluate(() => (window.speechSynthesis as unknown as { spoken: string[] }).spoken);
    expect(spoken[0]).toBe(guide.intro[0].text);
  });

  test("launcher opens the panel and the guide can be closed", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("guide-open").click();
    await expect(page.getByTestId("guide-panel")).toBeVisible();
    await expect(page.getByTestId("guide-caption")).toHaveText(guide.prompts.idle);
    await page.getByRole("button", { name: guide.prompts.close }).click();
    await expect(page.getByTestId("guide-open")).toBeVisible();
  });

  test("narration follows the walkthrough scenes", async ({ page }) => {
    await page.goto("/");
    const section = page.getByTestId("walkthrough");
    const box = (await section.boundingBox())!;
    const viewport = page.viewportSize()!;
    const perScene = (box.height - viewport.height) / walkthrough.length;

    await page.evaluate((top) => window.scrollTo(0, top), box.y + 10);
    await page.getByTestId("walkthrough-voice").click();
    await expect(page.getByTestId("walkthrough-voice")).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByTestId("guide-caption")).toHaveText(walkthrough[0].spoken[0].text);

    await page.evaluate((top) => window.scrollTo(0, top), box.y + perScene * 2 + 10);
    await expect(section).toHaveAttribute("data-scene", walkthrough[2].id);
    await expect(page.getByTestId("guide-caption")).toHaveText(walkthrough[2].spoken[0].text, { timeout: 4000 });

    await page.getByTestId("guide-narrate").click();
    await expect(page.getByTestId("walkthrough-voice")).toHaveAttribute("aria-pressed", "false");
  });
});
