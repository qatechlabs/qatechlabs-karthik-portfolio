# Deployment: Vercel and karthik.qatechlabs.com

## 1. Import the repository

1. Sign in at https://vercel.com and choose **Add New → Project**.
2. Import `qatechlabs/qatechlabs-karthik-portfolio`.
3. Framework preset: **Next.js** (detected automatically). Leave build and output settings at their defaults.
4. Add an environment variable for **Production** (and Preview if you want correct canonical URLs there):
   - `NEXT_PUBLIC_SITE_URL` = `https://karthik.qatechlabs.com`
5. Deploy. Vercel builds every pull request as a preview deployment.

## 2. Connect the custom domain

1. In the Vercel project, open **Settings → Domains** and add `karthik.qatechlabs.com`.
2. At the DNS provider for `qatechlabs.com`, add the record Vercel shows. For a subdomain this is normally:

   | Type | Name | Value |
   | --- | --- | --- |
   | CNAME | `karthik` | `cname.vercel-dns.com` |

   Use the exact value Vercel displays if it differs.
3. Wait for verification. Vercel issues the TLS certificate automatically.
4. Optional: also add `www.karthik.qatechlabs.com` and set it to redirect to the apex subdomain.

## 3. Protect `main`

In GitHub, **Settings → Branches → Add rule** for `main`:

- Require a pull request before merging.
- Require status checks: **Lint, typecheck, build** and **Playwright end-to-end**.

## 4. Before going live

- `npm run content:audit -- --strict` should report no placeholders, or you have consciously accepted the ones left.
- Add the résumé PDF and set `links.resumePdf` (see the README).
- Check the Open Graph preview with a tool such as https://www.opengraph.xyz/ after the domain is live.
- Submit `https://karthik.qatechlabs.com/sitemap.xml` in Google Search Console.

## Notes

- Every page is prerendered at build time. There is no server-side data fetching or secret.
- Security headers (nosniff, referrer policy, frame denial, permissions policy) are set in `next.config.ts`.
