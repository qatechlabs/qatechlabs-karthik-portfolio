import { isPending, labEntries, labStatusLabel, type LabStatus } from "@/content";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { VerifiedText } from "@/components/ui/Pending";
import { TagList } from "@/components/ui/TagList";
import { cn } from "@/lib/cn";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Engineering Lab",
  description: "Personal engineering work in AI-augmented quality engineering, Playwright tooling, and business-outcome validation, labelled by status.",
  path: "/lab",
});

const statusStyle: Record<LabStatus, string> = {
  published: "border-emerald-300/40 text-emerald-200",
  "in-progress": "border-rose-400/50 text-rose-200",
  exploration: "border-mist-400/40 text-mist-300",
  planned: "border-paper-100/20 text-mist-400",
};

export default function LabPage() {
  return (
    <>
      <PageHeader
        eyebrow="Engineering Lab"
        title="Where I test ideas before I trust them."
        intro="Personal work in AI-augmented quality engineering and test tooling. Each entry is labelled honestly: explorations are explorations, and only public, inspectable work is marked published."
      />
      <Container className="py-20">
        <ul className="grid gap-6 md:grid-cols-2">
          {labEntries.map((entry) => (
            <li key={entry.slug} data-testid="lab-entry" className="flex flex-col rounded-[1.25rem] border border-paper-100/[0.08] bg-navy-900/70 p-7 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <span className={cn("rounded-full border px-3 py-1 font-mono text-[0.65rem] tracking-[0.16em] uppercase", statusStyle[entry.status])}>
                  {labStatusLabel[entry.status]}
                </span>
              </div>
              <h2 className="mt-6 font-display text-[1.75rem] leading-tight text-paper-50">{entry.title}</h2>
              <p className="mt-3 leading-relaxed text-mist-300">{entry.summary}</p>
              <ul className="mt-5 space-y-2 text-sm text-mist-400">
                {entry.focus.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.6rem] h-px w-3 shrink-0 bg-rose-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-8">
                <TagList items={entry.stack} label={`${entry.title} stack`} />
                {isPending(entry.repository) ? (
                  <VerifiedText value={entry.repository} />
                ) : (
                  <ButtonLink href={entry.repository.href} variant="secondary">
                    {entry.repository.label}
                  </ButtonLink>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
