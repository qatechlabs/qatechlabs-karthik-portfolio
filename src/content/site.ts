import { pending, type SiteConfig } from "./types";

/**
 * Identity, navigation, and contact links.
 *
 * Sources: Karthik's brief (2026-11-04) and his public GitHub profile README.
 * Anything not present in those sources is `pending`.
 */
export const site: SiteConfig = {
  name: "Karthik Kodati",
  shortName: "Karthik Kodati",
  brand: "Architecture of Confidence",
  role: "Quality Engineering Architect",
  roles: [
    "Quality Engineering Architect",
    "Senior SDET",
    "Test Automation Lead",
    "AI-Powered Quality Engineering",
  ],
  tagline: "I design the test systems that let engineering teams release with confidence.",
  description:
    "Karthik Kodati is a Quality Engineering Architect and Senior SDET with 9+ years of experience in enterprise test automation, framework architecture, API and event-driven validation, CI/CD quality gates, and AI-augmented quality engineering.",
  location: "Hyderabad, India",
  yearsOfExperience: "9+",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://karthik.qatechlabs.com",
  nav: [
    { label: "About", href: "/about" },
    { label: "Experience", href: "/experience" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Engineering Lab", href: "/lab" },
    { label: "Insights", href: "/insights" },
    { label: "Contact", href: "/contact" },
  ],
  links: {
    github: { label: "GitHub", href: "https://github.com/karthik-testauro" },
    linkedin: pending("Add LinkedIn profile URL"),
    email: pending("Add the public contact email address"),
    resumePdf: pending(
      "Add the résumé PDF at public/resume/karthik-kodati-resume.pdf and set this path",
    ),
    portfolioRepo: pending("Add the public repository URL for this website"),
  },
  openTo: [
    "Senior SDET",
    "Lead SDET",
    "Quality Engineering Architect",
    "Technical leadership in quality engineering",
  ],
  workPreference: pending(
    "State availability and work preference (remote, hybrid, relocation, notice period)",
  ),
};
