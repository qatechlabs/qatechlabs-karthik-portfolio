import { pending, type Role, type SkillGroup } from "./types";

/**
 * Career history, in the order supplied in Karthik's brief.
 * Titles and dates were not supplied and are marked pending.
 */
export const roles: Role[] = [
  {
    slug: "zensar",
    organisation: "Zensar Technologies",
    title: pending("Add job title at Zensar Technologies"),
    period: pending("Add start and end dates (e.g. Mon YYYY – Present)"),
    summary:
      "Architected a scalable Playwright and TypeScript automation framework for global Workday HCM, Payroll, Finance, and Integrations.",
    highlights: [
      "Designed reusable page objects and dynamic locator strategies for Workday's generated UI.",
      "Introduced multi-country configuration and tenant-aware test execution.",
      "Enabled parallel and cross-browser execution.",
      "Added API integration coverage alongside end-to-end business flows.",
    ],
    stack: ["Playwright", "TypeScript", "Workday", "REST", "SOAP", "CI/CD"],
    caseStudy: "workday-automation-framework",
  },
  {
    slug: "mphasis",
    organisation: "Mphasis",
    client: "JPMorgan Chase",
    title: pending("Add job title at Mphasis"),
    period: pending("Add start and end dates"),
    summary:
      "Led QA work on financial systems involving Kafka event streams, observability, debugging, and automated quality gates.",
    highlights: [
      "Validated Kafka event streams across financial-system workflows.",
      "Used observability tooling to trace and debug behaviour across services.",
      "Introduced automated quality gates into the delivery pipeline.",
    ],
    stack: ["Kafka", "Splunk", "Dynatrace", "SonarQube", "CI/CD"],
    caseStudy: "financial-event-stream-validation",
  },
  {
    slug: "smartncode",
    organisation: "SMARTnCODE",
    title: pending("Add job title at SMARTnCODE"),
    period: pending("Add start and end dates"),
    summary:
      "Led a test automation transformation, with a reported 40% reduction in test execution time.",
    highlights: [
      "Led the test automation transformation for the team.",
      "Reported a 40% reduction in test execution time.",
    ],
    stack: ["Test automation", "CI/CD"],
    caseStudy: "automation-transformation",
  },
  {
    slug: "exaze",
    organisation: "Exaze",
    title: pending("Add job title at Exaze"),
    period: pending("Add start and end dates"),
    summary:
      "Worked on Android and iOS automation, continuous integration, test coverage, and release-quality ownership.",
    highlights: [
      "Automated Android and iOS test coverage.",
      "Integrated mobile tests with continuous integration.",
      "Owned release quality for mobile deliveries.",
    ],
    stack: ["Android", "iOS", "Mobile automation", "CI"],
    caseStudy: "mobile-release-quality",
  },
  {
    slug: "progment",
    organisation: "Progment",
    title: pending("Add the engineering and QA leadership titles held at Progment"),
    period: pending("Add start and end dates"),
    summary:
      "Progressed through engineering and QA leadership roles, establishing automation and quality practices for enterprise and public-sector systems.",
    highlights: [
      "Established automation and quality practices for enterprise systems.",
      "Applied the same practices to public-sector systems.",
    ],
    stack: ["Test automation", "Quality practices"],
  },
];

export const skills: SkillGroup[] = [
  {
    area: "Automation",
    items: ["Playwright", "TypeScript", "JavaScript", "Selenium", "Mobile automation (Android, iOS)"],
  },
  {
    area: "APIs and integration",
    items: ["REST APIs", "SOAP integrations", "Workday Integrations", "Kafka"],
  },
  {
    area: "Delivery and quality signals",
    items: ["GitHub", "CI/CD", "SonarQube", "Splunk", "Dynatrace"],
  },
  {
    area: "Enterprise domains",
    items: ["Workday HCM", "Payroll", "Finance", "Financial services", "Public sector"],
  },
  {
    area: "Current direction",
    items: ["AI-assisted test generation", "API testing workflows", "Engineering tooling"],
  },
];

export const credentials = pending(
  "Add verified certifications and education, or remove this section",
);
