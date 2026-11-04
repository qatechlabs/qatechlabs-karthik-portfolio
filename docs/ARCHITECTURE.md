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
- **Narrated walkthrough** (`src/components/walkthrough/`): the heart of the homepage. Five first-person scenes
  (risk map, one test across countries and tenants, event flow beneath the UI, release gates, AI with
  deterministic assertions). The stage stays pinned while the visitor moves through it, and each diagram builds in
  step with their position, so it reads as Karthik explaining his work. "Play" advances it automatically at a
  reading pace; scene dots and arrow keys jump between scenes. Narration and beats live in
  `src/content/walkthrough.ts`; diagrams are inline SVG driven by `motion` values.
- **360° hero:** `ScrollHero` pins a full-viewport stage for `(headlines + 1) × 100svh` of scroll. `useScroll` progress drives `PortraitSequence`, a canvas that scrubs a preloaded frame sequence (or draws a wireframe placeholder when `hero.portrait.frames` is 0), and selects the headline. Reduced motion renders a still hero. See docs/PORTRAIT.md for producing the frames.
- **Execution order:** the hero's confidence stack plays once from L01 (UI and mobile) up to L06 (AI-augmented
  workflows) when it scrolls into view, then hands control to the visitor, with a Replay control. The same order
  opens the walkthrough as scene 01.
- **Spoken guide** (`src/components/guide/`): an animated presenter (blinking eyes, mouth that follows the speech, a
  pointer arm that lifts while explaining) with live captions. It introduces the profile from the hero button and
  can narrate the walkthrough scene by scene. The guide speaks in the third person as a narrator, so no synthetic
  voice impersonates Karthik. Speech uses the browser's speech synthesis by default; any line can point at a
  recorded file (`audio: "/audio/….mp3"`) in `src/content/guide.ts` or `src/content/walkthrough.ts`. Speech is
  always started by the visitor, never on page load. Script lives in content, not components.
- **Other motion:** continuous and scroll-linked only. The confidence stack is an interactive control, cards tilt
  toward the pointer with a spotlight, figures count up once, the experience timeline fills, case studies have a
  reading-progress bar, a tracking table of contents, and an architecture pipeline that lights up once. Section
  reveals are a single soft rise, with no per-item staggers, loops, pulses, or page fades.
- Every effect checks `prefers-reduced-motion` (via `MotionConfig reducedMotion="user"` and `useReducedMotion`)
  and renders the final state immediately. With reduced motion the walkthrough lays its scenes out in sequence
  with finished diagrams. Touch devices skip pointer-only effects.
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
- `components/hero`: ScrollHero, PortraitSequence.
- `components/home`: Hero (wraps ScrollHero), StackSection, ConfidenceStack, StatsBand, homepage sections.
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
| `motion` (Framer Motion successor) for interaction | Scroll-linked motion values, layout animation and reduced-motion handling in one dependency |
| Scroll-scrubbed walkthrough rather than timed animation | Motion tied to the visitor's position reads as explanation; timed pulses and staggers read as flicker |
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
