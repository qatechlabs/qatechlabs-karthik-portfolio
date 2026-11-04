# Architecture and design decisions

## Brand concept: Architecture of Confidence

Quality engineering is presented as architecture: layered, deliberate, and evidence-based. The homepage
centrepiece is the **confidence stack**, the layers Karthik designs and validates (UI and mobile, API and
integrations, event streams, observability, quality gates, AI-augmented workflows), read from foundation to
release confidence. It is built from HTML so it is crisp, accessible, and responsive. It is not a decorative image.

## Design system

| Token group | Values | Use |
| --- | --- | --- |
| Midnight navy | `navy-950 #080f1d` → `navy-600 #2b3f66`, `ink #060a14` | Page foundation, surfaces |
| Burgundy | `burgundy-950 #2a0b15` → `burgundy-600 #8e2c47` | Depth: gradients, principle and contact bands |
| Rose gold | `rose-200 #f2dccf` → `rose-600 #a9765f` | Accents: rules, emphasis, primary CTA, focus ring |
| Neutrals | `paper-50/100/200`, `mist-300/400/500` | Text hierarchy |

- **Type:** Newsreader (display serif, including italic for emphasis), IBM Plex Sans (body), and IBM Plex Mono
  (small uppercase labels). All are self-hosted through `next/font`.
- **Contrast:** body text on navy is 10:1 or better. Secondary text (`mist-400`) is above 6:1. The axe scan runs
  on every route.
- **Layout:** `max-w-7xl` container with 20/32/48 px gutters, a `max-w-3xl` reading measure, and hairline
  dividers in place of heavy cards.
- **Motion and interaction** (built on `motion`, in `src/components/motion/`):
  - Hero: word-by-word headline, a pointer-following light, a slow rotating halo, and the interactive confidence
    stack (hover, click, focus, or arrow keys select a layer; a signal climbs the spine).
  - Scroll: sections reveal and stagger into view; stats count up; the experience timeline fills; case-study
    pages have a reading-progress bar, a table of contents that tracks the current section, and an architecture
    pipeline that lights up stage by stage.
  - Pointer: cards tilt toward the cursor with a spotlight; primary calls to action are magnetic.
  - Navigation: soft page transitions; the header hides on scroll down and returns on scroll up; the Lab filter
    animates between states.
  - Every effect checks `prefers-reduced-motion` (via `MotionConfig reducedMotion="user"` and `useReducedMotion`)
    and renders the final state immediately. Touch devices skip pointer-only effects.
- **Deliberately avoided:** neon glow, heavy glassmorphism, fake terminals, random geometry, and badge walls.
  Technologies are listed as quiet mono text.

## Sitemap

```
/                         Home: positioning, confidence stack, scale, featured work, capabilities, principles, career, CTA
/about                    Bio, approach, principles, toolkit
/experience               Timeline of five organisations, credentials
/case-studies             Index
/case-studies/[slug]      Long-form study (4, prerendered; unknown slugs → 404)
/lab                      Engineering Lab, each entry labelled published / in progress / exploration / planned
/insights                 Articles (planned topics until published)
/contact                  Contact routes, roles sought
/resume                   Printable résumé generated from the same content
/sitemap.xml /robots.txt /opengraph-image /manifest.webmanifest
```

## Content model

Typed in `src/content/types.ts`. The key idea is `Verified<T> = T | Pending`: any unverified fact is a
`pending(note)` value. The UI renders it as a visible placeholder, and `npm run content:audit` lists them all.
This makes the content-integrity rule enforceable in code rather than by convention.

A case study has: summary, role, period, stack, headline, problem, constraints, approach, components,
decisions (with rationale), integrations, architecture stages (rendered as a conceptual flow), media slots
(diagram, screenshot, pipeline, metrics), an optional synthetic code sample, outcomes, lessons, repository link,
and a confidentiality note. Sections with no content are omitted automatically.

## Component architecture

- `components/ui`: primitives (Container, Eyebrow, SectionHeading, ButtonLink, PendingNote/VerifiedText, TagList,
  PageHeader, PrintButton).
- `components/layout`: SiteHeader (the only client component besides PrintButton, for the mobile menu) and
  SiteFooter.
- `components/home`: Hero, ConfidenceStack, StatsBand, homepage sections.
- `components/case-study`: CaseStudyCard and CaseStudyBody (section registry plus renderers).

Pages are server components that compose these with content. Metadata goes through `lib/seo.ts` for consistent
canonical and Open Graph fields.

## Technical decisions

| Decision | Reason |
| --- | --- |
| Next.js 16.4 App Router, React 19.3 | Latest stable at build time |
| TypeScript 5.9, not 7.x | `typescript-eslint` and `eslint-config-next` support 5.x. TS 7 (native) is not yet supported by the lint toolchain |
| ESLint 9 | `eslint-config-next` 16 ships for ESLint 9 |
| Cache Components **off** | Every page is static content. With it on, `dynamicParams` is unsupported and unknown slugs return HTTP 200 with a not-found body. Off, they return a real 404 |
| `motion` (Framer Motion successor) for interaction | Spring physics, scroll-linked values, layout animation and reduced-motion handling in one dependency |
| No CMS or MDX | Content is small and typed. TypeScript gives compile-time checks on every edit |
| Chromium-only E2E (desktop and mobile) | Fast, deterministic CI. Add `firefox` and `webkit` projects in `playwright.config.ts` if wanted |
| Fonts via `next/font/google` | Self-hosted at build, no layout shift, no runtime request to Google |

## Implementation phases

1. Foundation: scaffold, tokens, typography, layout, header and footer. **Done**
2. Content model and placeholders. **Done**
3. Pages: home, about, experience, case studies, lab, insights, contact, résumé. **Done**
4. SEO: metadata, Open Graph image, sitemap, robots, JSON-LD, manifest. **Done**
5. Quality: Playwright and axe tests, CI workflow. **Done**
6. Launch: fill placeholders, add résumé PDF and media, deploy to Vercel, connect the domain. **Needs Karthik**
7. Later: publish Insights articles, publish Lab repositories, add sanitized diagrams.
