import { test, expect } from "@playwright/test";
import { caseStudies } from "../../src/content/case-studies";
import { site } from "../../src/content/site";

/** Routes every page-level test iterates over. Derived from content, so new pages are covered automatically. */
export const routes: { path: string; heading: RegExp }[] = [
  { path: "/", heading: /quality engineering architect/i },
  { path: "/about", heading: /quality engineering, treated as engineering/i },
  { path: "/experience", heading: /years across enterprise/i },
  { path: "/case-studies", heading: /how the systems were designed/i },
  { path: "/lab", heading: /test ideas before I trust them/i },
  { path: "/insights", heading: /notes on building quality systems/i },
  { path: "/contact", heading: /tell me about the role/i },
  { path: "/resume", heading: new RegExp(site.name, "i") },
  ...caseStudies.map((study) => ({ path: `/case-studies/${study.slug}`, heading: new RegExp(escape(study.title), "i") })),
];

function escape(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export { test, expect, caseStudies, site };
