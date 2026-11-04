import Link from "next/link";
import { isPending, type CaseStudy } from "@/content";
import { ArrowRight } from "@/components/ui/ButtonLink";
import { TagList } from "@/components/ui/TagList";
import { cn } from "@/lib/cn";

export function CaseStudyCard({
  study,
  index,
  size = "default",
  headingLevel = "h3",
}: {
  study: CaseStudy;
  index: number;
  size?: "default" | "large";
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <article
      data-testid="case-study-card"
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-paper-100/[0.08] bg-gradient-to-b from-navy-850/80 to-navy-900/60 p-7 transition-colors duration-300 hover:border-rose-500/40 sm:p-9",
        size === "large" && "lg:col-span-2 lg:p-12",
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-burgundy-800/30 blur-3xl transition-opacity duration-500 group-hover:opacity-100 lg:opacity-60"
      />
      <div className="relative flex items-center justify-between font-mono text-[0.7rem] tracking-[0.18em] text-mist-500 uppercase">
        <span>Case study {String(index + 1).padStart(2, "0")}</span>
        <span className="text-right">{study.organisation}</span>
      </div>
      <Heading
        className={cn(
          "relative mt-8 font-display font-normal tracking-tight text-paper-50",
          size === "large" ? "max-w-2xl text-[2.1rem] leading-[1.1] sm:text-[2.6rem]" : "text-[1.75rem] leading-[1.15]",
        )}
      >
        <Link href={`/case-studies/${study.slug}`} className="after:absolute after:inset-0 after:content-['']">
          {study.title}
        </Link>
      </Heading>
      <p className="relative mt-4 max-w-2xl leading-relaxed text-mist-300">{study.summary}</p>
      {!isPending(study.headline) ? (
        <p className="relative mt-5 border-l border-rose-500/60 pl-4 text-sm text-rose-200">{study.headline}</p>
      ) : null}
      <div className="relative mt-auto flex flex-wrap items-end justify-between gap-6 pt-10">
        <TagList items={study.stack.slice(0, 5)} label="Technologies" />
        <span className="inline-flex items-center gap-2 text-sm text-paper-100 transition-colors group-hover:text-rose-300" aria-hidden="true">
          Read case study <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
