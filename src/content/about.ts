import { pending } from "./types";

/**
 * About page copy. Facts come from Karthik's brief and public GitHub profile.
 */
export const about = {
  intro:
    "I'm a quality engineering professional with 9+ years of experience designing, building, and leading automation across enterprise applications, financial systems, public-sector systems, and mobile platforms.",
  body: [
    "My work is building automation frameworks, not only writing automated tests. That means architecture decisions: how a framework handles configuration across countries and tenants, how UI and API evidence fit together, how suites run in parallel inside CI, and how a team extends the framework without breaking it.",
    "At Zensar Technologies I architected a Playwright and TypeScript framework for global Workday HCM, Payroll, Finance, and Integrations. I have also led QA on financial systems built on Kafka event streams, led a test automation transformation, owned mobile release quality on Android and iOS, and progressed through engineering and QA leadership roles.",
    "My current direction is AI-augmented quality engineering: combining deterministic automation with responsible AI for test generation, API testing, and engineering tooling. I treat that work as engineering, with the same expectations for review, evidence, and accountability.",
  ],
  approach: [
    {
      title: "Start from risk",
      body: "Decide what has to be true for a release to be safe, then design coverage around it.",
    },
    {
      title: "Architect for the next engineer",
      body: "Clear layers, typed interfaces, and conventions that make the framework easy to extend.",
    },
    {
      title: "Make failures cheap to diagnose",
      body: "Traces, logs, and API evidence attached to every failure, so debugging starts with facts.",
    },
    {
      title: "Keep the signal honest",
      body: "Flaky tests are defects. A quality gate is only useful when the team trusts it.",
    },
  ],
  portrait: pending("Add a professional portrait at public/media/portrait.jpg (4:5, at least 800×1000)"),
};
