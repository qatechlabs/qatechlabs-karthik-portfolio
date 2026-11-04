/**
 * Content model for the portfolio.
 *
 * Every piece of copy, link, and fact lives in `src/content/*`. UI components
 * only read these types. To update the site, edit the content files; no
 * component changes are needed.
 *
 * Content integrity: anything that has not been verified by Karthik is wrapped
 * in `pending("…")`. Pending values render as clearly marked placeholders and
 * are listed by `npm run content:audit`.
 */

export type Pending = {
  readonly kind: "pending";
  /** What needs to be supplied, written as an instruction to the editor. */
  readonly note: string;
};

/** A value that is either verified content or a marked placeholder. */
export type Verified<T> = T | Pending;

export function pending(note: string): Pending {
  return { kind: "pending", note };
}

export function isPending(value: unknown): value is Pending {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { kind?: unknown }).kind === "pending"
  );
}

export type ExternalLink = {
  label: string;
  href: string;
};

export type NavItem = {
  label: string;
  href: `/${string}`;
};

export type SiteConfig = {
  name: string;
  shortName: string;
  brand: string;
  role: string;
  roles: string[];
  tagline: string;
  description: string;
  location: string;
  yearsOfExperience: string;
  url: string;
  nav: NavItem[];
  links: {
    github: ExternalLink;
    linkedin: Verified<ExternalLink>;
    email: Verified<string>;
    /** Path under /public, e.g. "/resume/karthik-kodati-resume.pdf". */
    resumePdf: Verified<string>;
    portfolioRepo: Verified<ExternalLink>;
  };
  openTo: string[];
  workPreference: Verified<string>;
};

export type Stat = {
  value: string;
  label: string;
  /** Short qualifier so a figure is never shown without its context. */
  context: string;
};

export type Capability = {
  title: string;
  summary: string;
  tools: string[];
};

export type StackLayer = {
  id: string;
  name: string;
  detail: string;
  /** Tools shown when the layer is selected in the interactive stack. */
  tools: string[];
  /** Case study where this layer is discussed, if any. */
  caseStudy?: string;
};

export type Principle = {
  title: string;
  body: string;
};

export type Role = {
  slug: string;
  organisation: string;
  client?: string;
  title: Verified<string>;
  period: Verified<string>;
  location?: Verified<string>;
  summary: string;
  highlights: string[];
  stack: string[];
  caseStudy?: string;
};

export type DiagramStage = {
  label: string;
  items: string[];
};

export type CodeSample = {
  title: string;
  language: "ts" | "yaml" | "json" | "bash";
  caption: string;
  code: string;
};

export type MediaSlot = {
  kind: "diagram" | "screenshot" | "pipeline" | "metrics";
  title: string;
  /** Path under /public once a sanitized asset exists. */
  src?: string;
  alt: string;
  note: string;
};

export type Decision = {
  decision: string;
  rationale: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  organisation: string;
  client?: string;
  domain: string;
  summary: string;
  role: Verified<string>;
  period: Verified<string>;
  stack: string[];
  featured: boolean;
  headline: Verified<string>;
  problem: Verified<string>[];
  constraints: Verified<string>[];
  approach: Verified<string>[];
  components: { name: string; description: string }[];
  decisions: Decision[];
  integrations: string[];
  architecture: DiagramStage[];
  outcomes: Verified<string>[];
  lessons: Verified<string>[];
  media: MediaSlot[];
  code?: CodeSample;
  repository: Verified<ExternalLink>;
  confidentiality: string;
};

export type LabStatus = "published" | "in-progress" | "exploration" | "planned";

export type LabEntry = {
  slug: string;
  title: string;
  status: LabStatus;
  summary: string;
  focus: string[];
  stack: string[];
  repository: Verified<ExternalLink>;
};

export type InsightStatus = "published" | "planned";

export type Insight = {
  slug: string;
  title: string;
  status: InsightStatus;
  summary: string;
  topics: string[];
  /** External URL once the article is published (e.g. LinkedIn or a blog). */
  href?: string;
  publishedOn?: string;
};

export type SkillGroup = {
  area: string;
  items: string[];
};
