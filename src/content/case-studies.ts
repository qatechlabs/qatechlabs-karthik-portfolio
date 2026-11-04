import { pending, type CaseStudy } from "./types";

/**
 * Flagship case studies.
 *
 * Written only from facts in Karthik's brief, at the level of detail he
 * supplied. Constraints and approach describe the publicly known nature of the
 * platforms involved (for example, Workday's generated UI) and the components
 * Karthik listed. No client names beyond those in the brief, no internal
 * architecture, no proprietary code, and no metrics that were not supplied.
 *
 * Code samples are synthetic illustrations of a pattern, labelled as such.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: "workday-automation-framework",
    title: "A tenant-aware Playwright framework for global Workday",
    organisation: "Zensar Technologies",
    domain: "Enterprise HCM, Payroll, Finance, and Integrations",
    summary:
      "Architecture of a scalable Playwright and TypeScript framework covering Workday HCM, Payroll, Finance, and Integrations across countries and tenants.",
    role: pending("Confirm your role on this engagement (e.g. framework architect, automation lead)"),
    period: pending("Add engagement dates"),
    stack: ["Playwright", "TypeScript", "Workday", "REST", "SOAP", "CI/CD"],
    featured: true,
    headline: pending("Add one verified headline outcome (e.g. regression cycle time, coverage, countries supported)"),
    problem: [
      "A global Workday programme spans HCM, Payroll, Finance, and Integrations. Each area changes on its own release cadence, and each country brings its own rules, data, and configuration.",
      "Regression coverage has to keep pace with those changes without a separate suite for every country and tenant.",
    ],
    constraints: [
      "Workday generates much of its UI at runtime, so static selectors are brittle.",
      "The same business process behaves differently per country and per tenant.",
      "Integration behaviour has to be verified, not only what appears on screen.",
      "Suites must run fast enough to be useful inside CI, across more than one browser.",
    ],
    approach: [
      "Treat the framework as a product: a stable core, a clear extension model, and conventions that let other engineers contribute tests without touching the core.",
      "Move country and tenant differences out of test code and into configuration, so one test expresses a business process once.",
      "Combine UI flows with API integration checks so failures point to the layer that broke.",
      "Design for parallel and cross-browser execution from the start rather than retrofitting it.",
    ],
    components: [
      {
        name: "Reusable page objects",
        description: "Business-level actions over Workday screens, shared across HCM, Payroll, and Finance suites.",
      },
      {
        name: "Dynamic locator strategy",
        description: "Locators resolved from stable attributes and accessible labels rather than generated IDs.",
      },
      {
        name: "Multi-country configuration",
        description: "Country-specific data and rules supplied through configuration instead of branching test code.",
      },
      {
        name: "Tenant-aware execution",
        description: "Tests target a tenant by configuration, so the same suite runs against different environments.",
      },
      {
        name: "Parallel, cross-browser runner",
        description: "Execution split across workers and browsers to keep feedback inside the CI window.",
      },
      {
        name: "API integration coverage",
        description: "REST and SOAP checks that verify integrations directly, alongside the UI flows that depend on them.",
      },
    ],
    decisions: [
      {
        decision: "Playwright with TypeScript as the foundation",
        rationale: "Auto-waiting, browser contexts for isolation, built-in parallelism, and type safety across a large shared codebase.",
      },
      {
        decision: "Configuration over branching",
        rationale: "Country and tenant variation in data files keeps test logic readable and avoids duplicated suites.",
      },
      {
        decision: "API checks inside the same framework",
        rationale: "One reporting model and shared fixtures for UI and integration evidence.",
      },
    ],
    integrations: ["Workday HCM", "Workday Payroll", "Workday Finance", "Workday Integrations (REST, SOAP)", "CI/CD pipeline"],
    architecture: [
      { label: "Configuration", items: ["Country profiles", "Tenant targets", "Test data"] },
      { label: "Framework core", items: ["Fixtures", "Dynamic locators", "Page objects"] },
      { label: "Suites", items: ["HCM", "Payroll", "Finance", "Integrations"] },
      { label: "Execution", items: ["Parallel workers", "Cross-browser", "CI/CD"] },
      { label: "Evidence", items: ["Reports", "Traces", "API results"] },
    ],
    outcomes: [
      pending("Add verified outcome: regression execution time before and after"),
      pending("Add verified outcome: number of countries or tenants covered"),
      pending("Add verified outcome: adoption (teams or engineers contributing tests)"),
    ],
    lessons: [
      pending("Add a lesson learned from this engagement, in your own words"),
      pending("Add a second lesson learned"),
    ],
    media: [
      {
        kind: "diagram",
        title: "Sanitized framework architecture",
        alt: "Framework architecture diagram",
        note: "Add a sanitized diagram at public/media/workday-automation-framework/architecture.svg",
      },
      {
        kind: "pipeline",
        title: "CI/CD execution pipeline",
        alt: "CI/CD pipeline diagram",
        note: "Add a sanitized pipeline view (no internal hostnames or job names)",
      },
      {
        kind: "metrics",
        title: "Execution metrics",
        alt: "Execution time chart",
        note: "Add verified, non-confidential metrics only",
      },
    ],
    code: {
      title: "Tenant- and country-aware fixture",
      language: "ts",
      caption: "Synthetic illustration of the pattern. Not taken from any client codebase.",
      code: `import { test as base } from "@playwright/test";
import { loadProfile, type CountryProfile } from "./config";

type Fixtures = { profile: CountryProfile };

export const test = base.extend<Fixtures>({
  profile: async ({}, use, testInfo) => {
    // Country and tenant come from the project, not from the test body.
    const { country, tenant } = testInfo.project.metadata;
    await use(loadProfile({ country, tenant }));
  },
});

test("hire an employee", async ({ page, profile }) => {
  await page.goto(profile.baseUrl);
  // One business process, expressed once, driven by configuration.
});`,
    },
    repository: pending("Link a public, sanitized reference implementation if you publish one"),
    confidentiality:
      "Client configuration, data, screens, and code are not shown. The diagram and sample describe the general pattern only.",
  },
  {
    slug: "financial-event-stream-validation",
    title: "Validating Kafka event streams in financial systems",
    organisation: "Mphasis",
    client: "JPMorgan Chase",
    domain: "Financial services, event-driven architecture",
    summary:
      "QA leadership for financial systems built on Kafka event streams, using observability data and automated quality gates to keep releases trustworthy.",
    role: pending("Confirm your role (e.g. QA lead)"),
    period: pending("Add engagement dates"),
    stack: ["Kafka", "Splunk", "Dynatrace", "SonarQube", "CI/CD"],
    featured: true,
    headline: pending("Add one verified, non-confidential headline outcome"),
    problem: [
      "In an event-driven financial system, a business transaction is a sequence of messages across services rather than a single request and response.",
      "Quality has to be proven across that sequence, and failures have to be traced to the service and message where they started.",
    ],
    constraints: [
      "Financial correctness leaves little room for ambiguous test results.",
      "Events are asynchronous, so tests cannot assume ordering or timing.",
      "Production-like data is sensitive and cannot be exposed.",
      "Diagnosis depends on logs and traces held in observability platforms.",
    ],
    approach: [
      "Validate behaviour at the event level: what was published, what was consumed, and what changed as a result.",
      "Use Splunk and Dynatrace as test evidence, not only as production monitoring, to shorten debugging.",
      "Put automated quality gates in the pipeline so a build carries a clear pass or fail signal.",
    ],
    components: [
      { name: "Event-stream validation", description: "Checks on Kafka messages across financial-system workflows." },
      { name: "Observability-backed debugging", description: "Log and trace correlation in Splunk and Dynatrace to locate failures." },
      { name: "Automated quality gates", description: "Pipeline checks, including static analysis with SonarQube, before release." },
    ],
    decisions: [
      {
        decision: "Treat observability data as test evidence",
        rationale: "Asynchronous failures are often only visible in logs and traces, so they belong in the diagnosis loop.",
      },
      {
        decision: "Gate releases automatically",
        rationale: "A consistent, automated signal is easier to trust than manual sign-off under time pressure.",
      },
    ],
    integrations: ["Kafka", "Splunk", "Dynatrace", "SonarQube", "CI/CD pipeline"],
    architecture: [
      { label: "Producers", items: ["Upstream services"] },
      { label: "Event stream", items: ["Kafka topics"] },
      { label: "Consumers", items: ["Downstream services"] },
      { label: "Validation", items: ["Event checks", "State checks"] },
      { label: "Signals", items: ["Splunk", "Dynatrace", "Quality gates"] },
    ],
    outcomes: [
      pending("Add verified outcome: defect detection or escape rate, if shareable"),
      pending("Add verified outcome: time to diagnose failures, if shareable"),
    ],
    lessons: [pending("Add a lesson learned from validating event-driven systems")],
    media: [
      {
        kind: "diagram",
        title: "Generic event-validation flow",
        alt: "Event validation flow diagram",
        note: "Use a generic diagram only. No topic names, service names, or internal architecture.",
      },
      {
        kind: "pipeline",
        title: "Quality gate stages",
        alt: "Quality gate pipeline diagram",
        note: "Add a sanitized view of gate stages",
      },
    ],
    code: {
      title: "Asserting on an event without assuming timing",
      language: "ts",
      caption: "Synthetic illustration using a generic consumer. Not taken from any client codebase.",
      code: `import { expect } from "@playwright/test";

// Poll for the expected event instead of sleeping for a fixed time.
await expect
  .poll(async () => consumer.findEvent({ type: "PaymentSettled", correlationId }), {
    timeout: 30_000,
    intervals: [500, 1_000, 2_000],
  })
  .toMatchObject({ status: "SETTLED", amount: expectedAmount });`,
    },
    repository: pending("Link a public, synthetic demo if you publish one"),
    confidentiality:
      "No client data, topic names, service names, or internal architecture are shown. The flow is generic.",
  },
  {
    slug: "automation-transformation",
    title: "Leading a test automation transformation",
    organisation: "SMARTnCODE",
    domain: "Test automation strategy and delivery",
    summary:
      "Leadership of a test automation transformation with a reported 40% reduction in test execution time.",
    role: pending("Confirm your role (e.g. test automation lead)"),
    period: pending("Add engagement dates"),
    stack: ["Test automation", "CI/CD"],
    featured: true,
    headline: "Reported 40% reduction in test execution time",
    problem: [
      pending("Describe the starting point: how testing was done before the transformation"),
    ],
    constraints: [pending("Describe the constraints: team size, timeline, legacy tooling")],
    approach: [pending("Describe the approach you led and the order of changes")],
    components: [],
    decisions: [],
    integrations: [],
    architecture: [],
    outcomes: [
      "A reported 40% reduction in test execution time.",
      pending("Add how the 40% was measured (baseline, suite, period)"),
    ],
    lessons: [pending("Add a lesson learned from leading the transformation")],
    media: [
      {
        kind: "metrics",
        title: "Execution time before and after",
        alt: "Execution time comparison",
        note: "Add the measured baseline and result behind the reported 40%",
      },
    ],
    repository: pending("Link a public reference if available"),
    confidentiality: "No client code or data is shown.",
  },
  {
    slug: "mobile-release-quality",
    title: "Release-quality ownership for Android and iOS",
    organisation: "Exaze",
    domain: "Mobile applications",
    summary:
      "Android and iOS automation integrated with continuous integration, with ownership of test coverage and release quality.",
    role: pending("Confirm your role"),
    period: pending("Add engagement dates"),
    stack: ["Android", "iOS", "Mobile automation", "CI"],
    featured: false,
    headline: pending("Add one verified headline outcome"),
    problem: [
      "Mobile releases ship to two platforms with different behaviour, and a defect that reaches users is slow to fix once a build is in the stores.",
    ],
    constraints: [
      "Two platforms, Android and iOS, each with its own tooling.",
      pending("Add device coverage and release cadence constraints"),
    ],
    approach: [
      "Automate coverage on both platforms.",
      "Run mobile tests in continuous integration so each build carries a quality signal.",
      "Own release quality: coverage decisions and the go or no-go evidence.",
    ],
    components: [
      { name: "Android automation", description: "Automated coverage for the Android application." },
      { name: "iOS automation", description: "Automated coverage for the iOS application." },
      { name: "CI integration", description: "Mobile suites run as part of continuous integration." },
    ],
    decisions: [],
    integrations: ["Continuous integration"],
    architecture: [
      { label: "Builds", items: ["Android", "iOS"] },
      { label: "Automation", items: ["Mobile suites"] },
      { label: "CI", items: ["Per-build runs"] },
      { label: "Release", items: ["Coverage review", "Go / no-go"] },
    ],
    outcomes: [pending("Add verified outcome for mobile release quality")],
    lessons: [pending("Add a lesson learned from mobile automation")],
    media: [
      {
        kind: "screenshot",
        title: "Sanitized test report",
        alt: "Mobile test report",
        note: "Add a sanitized report screenshot with no application data",
      },
    ],
    repository: pending("Link a public reference if available"),
    confidentiality: "No application screens, data, or code are shown.",
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}

export const featuredCaseStudies = caseStudies.filter((study) => study.featured);
