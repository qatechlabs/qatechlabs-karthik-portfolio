import { expect, site, test } from "./fixtures";

test.describe("homepage calls to action", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Explore my work opens the case studies", async ({ page }) => {
    await page.getByTestId("cta-explore").click();
    await expect(page).toHaveURL(/\/case-studies$/);
  });

  test("View GitHub points to the verified profile in a new tab", async ({ page }) => {
    const github = page.getByTestId("cta-github");
    await expect(github).toHaveAttribute("href", site.links.github.href);
    await expect(github).toHaveAttribute("target", "_blank");
    await expect(github).toHaveAttribute("rel", /noopener/);
  });

  test("Download résumé resolves to a working target", async ({ page, request }) => {
    const href = await page.getByTestId("cta-resume").getAttribute("href");
    expect(href).toBeTruthy();
    const response = await request.get(href!);
    expect(response.status()).toBe(200);
  });

  test("Get in touch opens the contact page", async ({ page }) => {
    await page.getByTestId("cta-contact").click();
    await expect(page).toHaveURL(/\/contact$/);
  });

  test("contact band links to the contact page", async ({ page }) => {
    await page.getByTestId("cta-contact-band").click();
    await expect(page).toHaveURL(/\/contact$/);
  });
});

test("contact page exposes the GitHub profile", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByTestId("contact-github")).toHaveAttribute("href", site.links.github.href);
});
