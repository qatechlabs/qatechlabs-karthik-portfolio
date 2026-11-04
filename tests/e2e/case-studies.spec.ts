import { caseStudies, expect, test } from "./fixtures";

test("case study index lists every study and each link resolves", async ({ page }) => {
  await page.goto("/case-studies");
  const cards = page.getByTestId("case-study-card");
  await expect(cards).toHaveCount(caseStudies.length);

  for (const study of caseStudies) {
    const link = page.getByRole("link", { name: study.title });
    await expect(link).toHaveAttribute("href", `/case-studies/${study.slug}`);
  }
});

test("homepage features only featured case studies", async ({ page }) => {
  await page.goto("/");
  const featured = caseStudies.filter((study) => study.featured);
  await expect(page.getByTestId("case-study-card")).toHaveCount(featured.length);
});

for (const study of caseStudies) {
  test(`${study.slug}: sections, table of contents, and next link`, async ({ page, isMobile }) => {
    await page.goto(`/case-studies/${study.slug}`);
    await expect(page.getByRole("heading", { level: 2, name: "Business problem" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Outcomes" })).toBeVisible();

    if (!isMobile) {
      const toc = page.getByRole("navigation", { name: "On this page" });
      const first = toc.getByRole("link").first();
      const target = await first.getAttribute("href");
      await first.click();
      await expect(page).toHaveURL(new RegExp(`${target}$`));
    }

    const next = page.getByTestId("next-case-study");
    const href = await next.getAttribute("href");
    await next.click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
  });
}

test("experience timeline links to existing case studies", async ({ page }) => {
  await page.goto("/experience");
  const links = page.getByRole("link", { name: "Read the case study" });
  const count = await links.count();
  expect(count).toBeGreaterThan(0);
  const slugs = new Set(caseStudies.map((study) => `/case-studies/${study.slug}`));
  for (let i = 0; i < count; i++) {
    expect(slugs.has((await links.nth(i).getAttribute("href")) ?? "")).toBe(true);
  }
});
