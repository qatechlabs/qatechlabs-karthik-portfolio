# Karthik Kodati — Architecture of Confidence

Personal portfolio for **Karthik Kodati**, Quality Engineering Architect and Senior SDET.
Production site: **https://karthik.qatechlabs.com** (once deployed).

Built with Next.js 16 (App Router), React 19, TypeScript (strict), and Tailwind CSS 4.
Tested with Playwright and axe-core. Checked in CI on every pull request.

## Quick start

```bash
npm ci
npm run dev          # http://localhost:3000
```

Requires Node.js 20.9 or later (CI uses Node 22).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build (all pages prerendered) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (Next.js core-web-vitals and TypeScript rules) |
| `npm run typecheck` | Generates route types, then `tsc --noEmit` |
| `npm run test:e2e` | Playwright tests against the production build (run `npm run build` first) |
| `npm run content:audit` | Lists every content placeholder still to be filled in |
| `npm run verify` | Lint, typecheck, build, and end-to-end tests in sequence |

First-time Playwright setup: `npx playwright install chromium`.

## Updating content

All copy, links, and career data live in [`src/content/`](src/content). Components only read from it, so you can
edit the content without touching any UI code.

| File | Holds |
| --- | --- |
| `site.ts` | Name, roles, navigation, GitHub/LinkedIn/email, résumé PDF path |
| `home.ts` | Homepage figures, confidence stack layers, capabilities, principles |
| `experience.ts` | Roles (titles, dates, highlights), skills, credentials |
| `case-studies.ts` | Case studies: problem, constraints, approach, components, decisions, outcomes, media |
| `lab.ts` | Engineering Lab entries and their status |
| `insights.ts` | Articles (planned or published with an external URL) |
| `about.ts` | About page copy and portrait |

### Placeholders and content integrity

Anything that has not been verified is wrapped in `pending("what to add")`. Pending values render as a dashed
**Placeholder** label on the page, so nothing unverified looks like a real claim.

- `npm run content:audit` lists every placeholder with its file and line.
- `npm run content:audit -- --strict` exits non-zero while any remain. Use it as a pre-launch gate.
- To resolve one, replace `pending("…")` with the real value, for example
  `email: pending("…")` → `email: "you@example.com"`.

Rules: do not add figures, dates, endorsements, or repository links that can't be verified. Code samples in case
studies are synthetic and labelled as illustrative. No client data, internal architecture, or proprietary code.

### Assets

- **Résumé PDF:** add `public/resume/karthik-kodati-resume.pdf`, then set `links.resumePdf` in `site.ts` to
  `"/resume/karthik-kodati-resume.pdf"`. Until then, "Download résumé" opens the printable `/resume` page.
- **Portrait:** add `public/media/portrait.jpg` and update `about.ts`.
- **Case-study media:** add sanitized files under `public/media/<slug>/` and set `src` on the matching `media` entry.

## Project structure

```
src/
  app/                 Routes (App Router), metadata, sitemap, robots, OG image
  components/
    layout/            Header (responsive nav), footer
    home/              Hero, confidence stack, stats, homepage sections
    case-study/        Card and long-form case study body
    ui/                Container, headings, buttons, placeholders, tags
  content/             Typed content model and all site content
  lib/                 SEO helpers, link helpers
tests/e2e/             Playwright specs
scripts/               Content audit
docs/                  Architecture and deployment notes
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the design system and decisions, and
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for Vercel and custom-domain setup.

## Testing

Playwright runs on desktop Chromium and a mobile (Pixel 7) profile:

- **Navigation:** every route renders a single `h1` and a title; desktop nav and `aria-current`; mobile menu open,
  navigate, close, and Escape; skip link; 404s for unknown routes and case-study slugs.
- **Calls to action:** Explore my work, View GitHub (correct URL, new tab, `rel=noopener`), Download résumé
  (target returns 200), Get in touch.
- **Case studies:** index lists every study, every link resolves, table of contents, next-study link, and
  experience-to-case-study links.
- **Responsiveness:** no horizontal overflow on every route at 360, 768, 1280, and 1680 px; reduced-motion
  renders final states without animation.
- **Interactions:** confidence stack selection (pointer and arrow keys), stat count-up, Lab filter, hide-on-scroll
  header, reading progress, table-of-contents tracking, and the architecture pipeline.
- **Accessibility and SEO:** axe WCAG 2.1 AA scan on every route; canonical, Open Graph, JSON-LD, sitemap,
  robots, and OG image.

The test route list is derived from the content model, so a new case study is covered automatically.
