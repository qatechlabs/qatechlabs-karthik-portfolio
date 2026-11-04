/**
 * The homepage walkthrough: five scenes in which Karthik explains how he
 * builds release confidence. Each scene pairs first-person narration with a
 * diagram that builds as the visitor moves through it.
 *
 * Narration is written in Karthik's voice from the facts in his brief. The
 * diagrams are conceptual and contain no client data or internal architecture.
 */
export type WalkthroughScene = {
  id: "risk" | "framework" | "beneath" | "gates" | "ai";
  kicker: string;
  title: string;
  narration: string[];
  /** Short captions shown on the diagram as its steps complete. */
  beats: string[];
  link?: { label: string; href: string };
};

export const walkthrough: WalkthroughScene[] = [
  {
    id: "risk",
    kicker: "Where I start",
    title: "I start with what has to be true for a release to be safe.",
    narration: [
      "Before writing a single test I map the release: the business flows that matter, the integrations they depend on, and where a defect would actually hurt.",
      "Coverage is then designed to retire that risk, not to raise a test count.",
    ],
    beats: ["Business flows", "Dependencies", "Risk", "Coverage designed to retire it"],
    link: { label: "How I work", href: "/about" },
  },
  {
    id: "framework",
    kicker: "Global Workday at Zensar",
    title: "Then I build one framework that speaks every country and tenant.",
    narration: [
      "On a global Workday programme, the same hiring or payroll process behaves differently per country and per tenant.",
      "I moved that variation out of the tests and into configuration, so one business process is written once and runs everywhere, in parallel, across browsers.",
    ],
    beats: ["One test, written once", "Country profiles", "Tenant targets", "Parallel, cross-browser runs"],
    link: { label: "Workday framework case study", href: "/case-studies/workday-automation-framework" },
  },
  {
    id: "beneath",
    kicker: "Financial systems at JPMorgan Chase, via Mphasis",
    title: "I prove behaviour beneath the UI, where the business rules execute.",
    narration: [
      "In an event-driven financial system a transaction is a sequence of Kafka messages across services, not a screen.",
      "I validate what was published, what was consumed, and what changed, and I use Splunk and Dynatrace evidence to trace a failure to the message where it began.",
    ],
    beats: ["Event published", "Consumed downstream", "State verified", "Traced in observability"],
    link: { label: "Event-stream case study", href: "/case-studies/financial-event-stream-validation" },
  },
  {
    id: "gates",
    kicker: "Every change, every build",
    title: "Every change passes through gates the team can trust.",
    narration: [
      "The framework runs in CI on every change: linting, parallel test workers, API checks, and static analysis with SonarQube.",
      "A build carries a clear signal about whether it is ready. People stop overriding a gate once it has earned their trust.",
    ],
    beats: ["Change", "Lint and types", "Parallel tests", "Quality gate", "Release"],
    link: { label: "Case studies", href: "/case-studies" },
  },
  {
    id: "ai",
    kicker: "Where I am heading",
    title: "Now I let AI draft and triage, while the assertions stay deterministic.",
    narration: [
      "AI is useful for proposing tests, generating API scenarios, and summarising failures.",
      "In my workflows the engineer reviews what it proposes and the pass or fail decision is never left to a model. AI amplifies judgment; it does not replace the person accountable for the release.",
    ],
    beats: ["AI proposes", "Engineer reviews", "Deterministic assertion", "Accountable release"],
    link: { label: "Engineering Lab", href: "/lab" },
  },
];
