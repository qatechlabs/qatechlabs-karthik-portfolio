import type { Insight } from "./types";

/**
 * Insights: articles and notes.
 *
 * Nothing has been published yet. These are planned topics, shown as planned.
 * When an article goes live, set `status: "published"`, add `href` (the
 * canonical URL) and `publishedOn` (YYYY-MM-DD).
 */
export const insights: Insight[] = [
  {
    slug: "tenant-aware-automation",
    title: "Designing tenant-aware automation for global enterprise platforms",
    status: "planned",
    summary: "Moving country and tenant variation out of test code and into configuration.",
    topics: ["Framework architecture", "Workday"],
  },
  {
    slug: "testing-event-streams",
    title: "Testing event streams without sleeping",
    status: "planned",
    summary: "Asserting on asynchronous Kafka events with polling, correlation IDs, and observability evidence.",
    topics: ["Kafka", "Event-driven systems"],
  },
  {
    slug: "quality-gates-teams-trust",
    title: "Quality gates that teams trust",
    status: "planned",
    summary: "What makes an automated release signal credible enough that people stop overriding it.",
    topics: ["CI/CD", "Quality governance"],
  },
  {
    slug: "ai-in-deterministic-suites",
    title: "Where AI belongs in a deterministic test suite",
    status: "planned",
    summary: "Using AI for generation and triage while keeping pass or fail decisions deterministic.",
    topics: ["AI-assisted QE", "Playwright"],
  },
];
