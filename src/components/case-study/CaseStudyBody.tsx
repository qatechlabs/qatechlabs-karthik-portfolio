import type { ReactNode } from "react";
import { isPending, type CaseStudy, type MediaSlot, type Verified } from "@/content";
import { PendingNote, VerifiedText } from "@/components/ui/Pending";
import { TagList } from "@/components/ui/TagList";

export const caseStudySections = [
  { id: "problem", label: "Business problem" },
  { id: "constraints", label: "Constraints" },
  { id: "approach", label: "Architectural approach" },
  { id: "architecture", label: "Architecture" },
  { id: "components", label: "Framework components" },
  { id: "decisions", label: "Key decisions" },
  { id: "integrations", label: "Integrations" },
  { id: "evidence", label: "Evidence" },
  { id: "outcomes", label: "Outcomes" },
  { id: "lessons", label: "Lessons learned" },
] as const;

type SectionId = (typeof caseStudySections)[number]["id"];

/** Which sections have content for this study (empty sections are skipped). */
export function sectionsFor(study: CaseStudy) {
  const has: Record<SectionId, boolean> = {
    problem: study.problem.length > 0,
    constraints: study.constraints.length > 0,
    approach: study.approach.length > 0,
    architecture: study.architecture.length > 0,
    components: study.components.length > 0,
    decisions: study.decisions.length > 0,
    integrations: study.integrations.length > 0,
    evidence: study.media.length > 0 || Boolean(study.code),
    outcomes: study.outcomes.length > 0,
    lessons: study.lessons.length > 0,
  };
  return caseStudySections.filter((section) => has[section.id]);
}

function Section({ id, label, index, children }: { id: string; label: string; index: number; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28 border-t border-paper-100/[0.08] py-12 first:border-t-0 first:pt-0">
      <p className="font-mono text-[0.7rem] tracking-[0.18em] text-rose-400/80" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </p>
      <h2 id={`${id}-title`} className="mt-3 font-display text-[2rem] leading-tight text-paper-50">
        {label}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Paragraphs({ items }: { items: Verified<string>[] }) {
  return (
    <div className="space-y-5 text-lg leading-relaxed text-mist-300">
      {items.map((item, i) => (
        <p key={i}>
          <VerifiedText value={item} />
        </p>
      ))}
    </div>
  );
}

function Bullets({ items }: { items: Verified<string>[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-4 leading-relaxed text-mist-300">
          <span aria-hidden="true" className="mt-[0.7rem] h-px w-4 shrink-0 bg-rose-500" />
          <span>
            <VerifiedText value={item} />
          </span>
        </li>
      ))}
    </ul>
  );
}

function ArchitectureFlow({ study }: { study: CaseStudy }) {
  return (
    <figure>
      <ol className="grid gap-3 md:grid-flow-col md:auto-cols-fr" aria-label="Architecture stages">
        {study.architecture.map((stage, index) => (
          <li key={stage.label} className="relative rounded-xl border border-paper-100/10 bg-navy-900/80 p-4">
            <p className="font-mono text-[0.65rem] tracking-[0.16em] text-rose-400 uppercase">
              {String(index + 1).padStart(2, "0")} · {stage.label}
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-paper-100">
              {stage.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {index < study.architecture.length - 1 ? (
              <span aria-hidden="true" className="absolute top-1/2 -right-2.5 hidden size-2 -translate-y-1/2 rotate-45 border-t border-r border-rose-500/70 md:block" />
            ) : null}
          </li>
        ))}
      </ol>
      <figcaption className="mt-4 text-sm text-mist-500">
        Conceptual flow based on the components described. It does not represent any client&rsquo;s internal architecture.
      </figcaption>
    </figure>
  );
}

const mediaKindLabel: Record<MediaSlot["kind"], string> = {
  diagram: "Architecture diagram",
  screenshot: "Screenshot",
  pipeline: "CI/CD pipeline",
  metrics: "Performance metrics",
};

function MediaFrame({ slot }: { slot: MediaSlot }) {
  return (
    <figure data-testid="media-slot" className="overflow-hidden rounded-xl border border-paper-100/10 bg-navy-900/60">
      {slot.src ? (
        // eslint-disable-next-line @next/next/no-img-element -- sanitized SVG/PNG assets of unknown dimensions
        <img src={slot.src} alt={slot.alt} className="w-full" loading="lazy" />
      ) : (
        <div className="bg-blueprint flex aspect-[16/9] items-center justify-center p-6 text-center">
          <PendingNote note={slot.note} />
        </div>
      )}
      <figcaption className="flex items-center justify-between gap-3 border-t border-paper-100/[0.07] px-4 py-3 text-sm">
        <span className="text-paper-100">{slot.title}</span>
        <span className="font-mono text-[0.65rem] tracking-[0.14em] text-mist-500 uppercase">{mediaKindLabel[slot.kind]}</span>
      </figcaption>
    </figure>
  );
}

export function CaseStudyBody({ study }: { study: CaseStudy }) {
  const sections = sectionsFor(study);
  const render: Record<SectionId, () => ReactNode> = {
    problem: () => <Paragraphs items={study.problem} />,
    constraints: () => <Bullets items={study.constraints} />,
    approach: () => <Bullets items={study.approach} />,
    architecture: () => <ArchitectureFlow study={study} />,
    components: () => (
      <dl className="grid gap-px overflow-hidden rounded-xl border border-paper-100/[0.08] bg-paper-100/[0.08] sm:grid-cols-2">
        {study.components.map((component) => (
          <div key={component.name} className="bg-navy-900 p-5">
            <dt className="font-medium text-paper-50">{component.name}</dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-mist-400">{component.description}</dd>
          </div>
        ))}
      </dl>
    ),
    decisions: () => (
      <dl className="space-y-6">
        {study.decisions.map((item) => (
          <div key={item.decision} className="border-l border-rose-500/50 pl-5">
            <dt className="font-medium text-paper-50">{item.decision}</dt>
            <dd className="mt-1.5 leading-relaxed text-mist-300">{item.rationale}</dd>
          </div>
        ))}
      </dl>
    ),
    integrations: () => <TagList items={study.integrations} label="Integrations" className="text-[0.85rem] text-paper-100" />,
    evidence: () => (
      <div className="space-y-6">
        {study.code ? (
          <figure className="overflow-hidden rounded-xl border border-paper-100/10 bg-ink">
            <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-paper-100/[0.07] px-4 py-3">
              <span className="text-sm text-paper-100">{study.code.title}</span>
              <span className="font-mono text-[0.65rem] tracking-[0.14em] text-rose-300 uppercase">Illustrative</span>
            </figcaption>
            <pre className="max-w-full overflow-x-auto p-5 font-mono text-[0.8rem] leading-relaxed text-paper-100" tabIndex={0} aria-label={`${study.code.title} code sample`}>
              <code>{study.code.code}</code>
            </pre>
            <p className="border-t border-paper-100/[0.07] px-4 py-3 text-xs text-mist-500">{study.code.caption}</p>
          </figure>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2">
          {study.media.map((slot) => (
            <MediaFrame key={slot.title} slot={slot} />
          ))}
        </div>
      </div>
    ),
    outcomes: () => <Bullets items={study.outcomes} />,
    lessons: () => <Bullets items={study.lessons} />,
  };

  return (
    <div>
      {sections.map((section, index) => (
        <Section key={section.id} id={section.id} label={section.label} index={index}>
          {render[section.id]()}
        </Section>
      ))}
    </div>
  );
}

export function hasPendingHeadline(study: CaseStudy) {
  return isPending(study.headline);
}
