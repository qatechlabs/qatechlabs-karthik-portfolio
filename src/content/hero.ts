/**
 * The 360° hero: a full-screen portrait that turns as the visitor scrolls,
 * while the headline moves through Karthik's roles.
 *
 * Headlines and notes come from Karthik's brief. The portrait is a frame
 * sequence he supplies (see docs/PORTRAIT.md); until then a labelled
 * wireframe placeholder turns in its place.
 */
import { pending, type Verified } from "./types";

export type HeroHeadline = {
  /** Lines of the headline, one per row. */
  lines: string[];
  /** The short supporting sentence shown with it. */
  note: string;
};

export type PortraitSequence = {
  /** Public directory holding `001.webp`, `002.webp`, … */
  dir: string;
  /** Number of frames in the sequence. 0 renders the placeholder. */
  frames: number;
  /** Status of the real portrait. */
  source: Verified<string>;
};

export const hero = {
  greeting: "Hi, I'm Karthik",
  headlines: [
    {
      lines: ["Quality", "Engineering", "Architect"],
      note: "I design the test systems that let engineering teams release with confidence.",
    },
    {
      lines: ["Senior", "SDET"],
      note: "9+ years in enterprise test automation with Playwright, TypeScript and Selenium.",
    },
    {
      lines: ["Test", "Automation", "Lead"],
      note: "One framework for global Workday. Kafka event validation for financial systems.",
    },
    {
      lines: ["AI-Powered", "Quality", "Engineering"],
      note: "AI drafts and triages. The assertions stay deterministic and an engineer stays accountable.",
    },
  ] satisfies HeroHeadline[],
  aside: {
    kicker: "Open to",
    text: "Senior SDET, Lead SDET and Quality Engineering Architect roles.",
    detail: "Based in Hyderabad, India.",
  },
  scrollCue: "Scroll to scrub timeline",
  portrait: {
    dir: "/media/portrait-360",
    frames: 0,
    source: pending(
      "Add the 360° portrait frames at public/media/portrait-360/001.webp … (see docs/PORTRAIT.md) and set frames to their count",
    ),
  } satisfies PortraitSequence,
};
