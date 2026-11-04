import AxeBuilder from "@axe-core/playwright";
import { caseStudies, expect, routes, site, test } from "./fixtures";

test.describe("accessibility (axe, WCAG 2.1 AA)", () => {
  test.skip(({ isMobile }) => isMobile, "Run once on desktop");
  for (const route of routes) {
    test(route.path, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(route.path);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.length} node(s)`)).toEqual([]);
    });
  }
});

test.describe("metadata and discovery", () => {
  test.skip(({ isMobile }) => isMobile, "Run once on desktop");

  test("homepage has description, canonical, and Open Graph tags", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{50,}/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", site.url);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", new RegExp(site.name));
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /opengraph-image/);
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
  });

  test("case study pages have their own canonical URL", async ({ page }) => {
    const study = caseStudies[0];
    await page.goto(`/case-studies/${study.slug}`);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${site.url}/case-studies/${study.slug}`);
  });

  test("sitemap lists every page", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    for (const route of routes) {
      const url = route.path === "/" ? site.url : `${site.url}${route.path}`;
      expect(xml).toContain(`<loc>${url}</loc>`);
    }
  });

  test("robots.txt allows crawling and points to the sitemap", async ({ request }) => {
    const body = await (await request.get("/robots.txt")).text();
    expect(body).toContain("Allow: /");
    expect(body).toContain(`Sitemap: ${site.url}/sitemap.xml`);
  });

  test("Open Graph image renders", async ({ request }) => {
    const response = await request.get("/opengraph-image");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
  });
});

test("content placeholders are visibly marked", async ({ page }) => {
  await page.goto("/contact");
  const placeholders = page.locator("[data-placeholder]");
  const count = await placeholders.count();
  for (let i = 0; i < count; i++) {
    await expect(placeholders.nth(i)).toContainText("Placeholder");
  }
});
