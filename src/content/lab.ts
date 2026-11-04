import { pending, type LabEntry } from "./types";
import { site } from "./site";

/**
 * Engineering Lab: personal engineering work.
 *
 * Status labels matter. Only mark an entry "published" when its repository is
 * public and inspectable. Experiments stay labelled as experiments.
 */
export const labEntries: LabEntry[] = [
  {
    slug: "portfolio-site",
    title: "This website",
    status: "in-progress",
    summary:
      "A Next.js App Router site with typed content separated from presentation, Playwright end-to-end tests, accessibility checks, and CI for linting, type checking, builds, and tests.",
    focus: [
      "Content model with explicit placeholders for unverified facts",
      "Playwright tests for navigation, responsiveness, links, and calls to action",
      "Automated accessibility scans with axe-core",
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Playwright", "GitHub Actions"],
    repository: site.links.portfolioRepo,
  },
  {
    slug: "ai-assisted-playwright",
    title: "AI-assisted Playwright and TypeScript automation",
    status: "exploration",
    summary:
      "Exploring where AI can help write and maintain Playwright tests while deterministic assertions stay in control of the result.",
    focus: ["Test-generation workflows", "Human review of generated tests", "Keeping assertions deterministic"],
    stack: ["Playwright", "TypeScript"],
    repository: pending("Repository not yet published"),
  },
  {
    slug: "agent-assisted-testing",
    title: "Agent-assisted testing workflows",
    status: "exploration",
    summary:
      "Investigating AI agents for test design, debugging support, and API testing, with clear limits on what the agent decides.",
    focus: ["Test design support", "Failure triage support", "API testing assistance"],
    stack: ["TypeScript", "REST APIs"],
    repository: pending("Repository not yet published"),
  },
  {
    slug: "business-truth-engine",
    title: "Business Truth Engine",
    status: "exploration",
    summary:
      "An experiment in verifying business outcomes rather than isolated UI assertions: did the workflow produce the result the business expects?",
    focus: ["Outcome-level assertions", "Business workflow validation"],
    stack: ["TypeScript"],
    repository: pending("Repository not yet published"),
  },
  {
    slug: "qe-utilities",
    title: "Open-source quality engineering utilities",
    status: "planned",
    summary: "Small, focused utilities for Playwright and API testing, to be published as they are ready.",
    focus: ["Reusable fixtures", "API testing helpers"],
    stack: ["Playwright", "TypeScript"],
    repository: pending("Repository not yet published"),
  },
];

export const labStatusLabel: Record<LabEntry["status"], string> = {
  published: "Published",
  "in-progress": "In progress",
  exploration: "Exploration",
  planned: "Planned",
};
