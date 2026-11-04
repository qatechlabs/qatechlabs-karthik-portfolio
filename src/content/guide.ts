/**
 * Script for the spoken guide.
 *
 * The guide is a narrator, not Karthik: it speaks in the third person so a
 * synthetic voice never impersonates him. Every fact comes from his brief.
 *
 * Voice: by default the browser's own speech synthesis reads these lines.
 * To use recorded audio instead, add files under /public/audio and set
 * `audio` on a line, e.g. { text: "…", audio: "/audio/intro-1.mp3" }.
 */
export type SpokenLine = { text: string; audio?: string };

export const guide = {
  name: "Guide",
  /** Spoken when the visitor asks for an introduction. About 40 seconds. */
  intro: [
    { text: "Welcome. This is the portfolio of Karthik Kodati, a Quality Engineering Architect and Senior SDET based in Hyderabad, India." },
    { text: "Karthik has more than nine years of experience in enterprise test automation: framework architecture, API and integration validation, event-driven systems, CI/CD quality gates, and mobile." },
    { text: "At Zensar Technologies he architected a Playwright and TypeScript framework for global Workday: HCM, Payroll, Finance, and Integrations, across countries and tenants." },
    { text: "With Mphasis, at JPMorgan Chase, he led QA on financial systems built on Kafka event streams, using Splunk and Dynatrace evidence and automated quality gates." },
    { text: "He led a test automation transformation at SMARTnCODE, with a reported forty percent reduction in test execution time, and owned Android and iOS release quality at Exaze." },
    { text: "Today he combines deterministic automation with responsible AI. Scroll down, and I will walk you through how he builds release confidence, layer by layer." },
  ] satisfies SpokenLine[],
  /** Short prompts used by the guide's interface. */
  prompts: {
    open: "Meet the guide",
    introduce: "Introduce Karthik",
    narrateOn: "Narrate as I scroll",
    narrateOff: "Stop narrating",
    stop: "Stop",
    close: "Close the guide",
    idle: "I can introduce Karthik, or narrate the walkthrough as you scroll.",
    unsupported: "Speech is not available in this browser, so I will show captions instead.",
  },
};
