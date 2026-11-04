import type { Capability, Principle, StackLayer, Stat } from "./types";

/**
 * Figures shown on the homepage. Each one is taken directly from Karthik's
 * brief. Do not add a figure here unless it can be substantiated.
 */
export const stats: Stat[] = [
  {
    value: "9+",
    label: "years in quality engineering",
    context: "Enterprise, financial services, public sector, and mobile",
  },
  {
    value: "5",
    label: "organisations",
    context: "Zensar, Mphasis (JPMorgan Chase), SMARTnCODE, Exaze, Progment",
  },
  {
    value: "4",
    label: "Workday domains automated",
    context: "HCM, Payroll, Finance, and Integrations on one framework",
  },
  {
    value: "40%",
    label: "reported reduction in test execution time",
    context: "Automation transformation at SMARTnCODE",
  },
];

/**
 * The "confidence stack": the layers of a release-quality system that
 * Karthik designs. Rendered as the homepage centrepiece.
 */
export const confidenceStack: StackLayer[] = [
  {
    id: "ai",
    name: "AI-augmented workflows",
    detail: "Test-generation and analysis tooling, reviewed by engineers",
  },
  {
    id: "gates",
    name: "Quality gates",
    detail: "CI/CD checks, SonarQube, release-readiness signals",
  },
  {
    id: "observability",
    name: "Observability",
    detail: "Splunk and Dynatrace evidence for faster diagnosis",
  },
  {
    id: "events",
    name: "Event streams",
    detail: "Kafka message validation for financial systems",
  },
  {
    id: "api",
    name: "API and integrations",
    detail: "REST and SOAP contracts, Workday integrations",
  },
  {
    id: "ui",
    name: "UI and mobile automation",
    detail: "Playwright, Selenium, Android and iOS",
  },
];

export const capabilities: Capability[] = [
  {
    title: "Framework architecture",
    summary:
      "Automation frameworks treated as production software: layered page objects, typed fixtures, configuration per country and tenant, and parallel cross-browser execution.",
    tools: ["Playwright", "TypeScript", "JavaScript", "Selenium"],
  },
  {
    title: "API and integration validation",
    summary:
      "Coverage below the UI, where business rules actually execute. REST and SOAP validation alongside the end-to-end flows that depend on them.",
    tools: ["REST APIs", "SOAP", "Workday Integrations"],
  },
  {
    title: "Event-driven systems",
    summary:
      "Validation of Kafka event streams in financial systems, with observability data used to trace and debug behaviour across services.",
    tools: ["Kafka", "Splunk", "Dynatrace"],
  },
  {
    title: "CI/CD and quality gates",
    summary:
      "Automated checks that run on every change and give teams a clear signal about whether a build is ready to release.",
    tools: ["GitHub", "CI/CD pipelines", "SonarQube"],
  },
  {
    title: "Mobile quality",
    summary:
      "Android and iOS automation integrated with continuous integration, with ownership of coverage and release quality.",
    tools: ["Android", "iOS", "Mobile automation"],
  },
  {
    title: "AI-augmented quality engineering",
    summary:
      "Combining deterministic automation with responsible AI: test-generation workflows, API testing assistance, and engineering tooling that keeps humans accountable.",
    tools: ["AI-assisted test design", "Agent workflows"],
  },
];

/** Engineering principles, taken from Karthik's public GitHub profile. */
export const principles: Principle[] = [
  {
    title: "Automate for measurable value",
    body: "Coverage is chosen for the risk it retires, not for the number of tests it adds.",
  },
  {
    title: "Test frameworks are production software",
    body: "They get architecture, code review, type safety, and maintenance like any other system.",
  },
  {
    title: "Reliability starts in CI/CD",
    body: "Quality signals are designed into the pipeline from the first commit, not bolted on before release.",
  },
  {
    title: "Observable over clever",
    body: "Maintainable, debuggable systems are preferred over shortcuts that are hard to diagnose later.",
  },
  {
    title: "AI amplifies judgment",
    body: "AI tooling supports engineering decisions. It does not replace the engineer who is accountable for them.",
  },
];
