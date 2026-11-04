import { insights } from "@/content";
import { ArrowUpRight } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { Spotlight } from "@/components/motion/Spotlight";
import { TagList } from "@/components/ui/TagList";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Insights",
  description: "Writing on test architecture, event-driven validation, quality gates, and AI in quality engineering.",
  path: "/insights",
});

export default function InsightsPage() {
  const published = insights.filter((item) => item.status === "published");
  const planned = insights.filter((item) => item.status === "planned");

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Notes on building quality systems."
        intro="Writing on test architecture, event-driven validation, quality gates, and the practical role of AI in testing."
      />
      <Container className="py-20">
        {published.length === 0 ? (
          <p className="max-w-2xl rounded-xl border border-paper-100/[0.08] bg-navy-900/60 p-6 text-mist-300" data-testid="insights-empty">
            No articles are published yet. The topics below are in preparation.
          </p>
        ) : (
          <ul className="divide-y divide-paper-100/[0.08] border-y border-paper-100/[0.08]">
            {published.map((item) => (
              <li key={item.slug} className="py-8">
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="group block">
                  <p className="font-mono text-[0.7rem] text-mist-500">{item.publishedOn}</p>
                  <h2 className="mt-2 inline-flex items-center gap-2 font-display text-[1.75rem] text-paper-50 group-hover:text-rose-200">
                    {item.title} <ArrowUpRight className="size-4" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </h2>
                  <p className="mt-2 text-mist-300">{item.summary}</p>
                </a>
              </li>
            ))}
          </ul>
        )}

        <section aria-labelledby="planned-title" className="mt-16">
          <h2 id="planned-title" className="font-mono text-[0.72rem] tracking-[0.18em] text-mist-500 uppercase">
            In preparation
          </h2>
          <Spotlight className="mt-6">
          <Reveal as="ul" className="grid gap-px overflow-hidden rounded-[1.25rem] border border-paper-100/[0.08] bg-paper-100/[0.08] md:grid-cols-2">
            {planned.map((item) => (
              <li key={item.slug} data-testid="insight-planned" data-spotlight className="w-full bg-navy-900 p-7 transition-colors hover:bg-navy-850">
                <span className="font-mono text-[0.65rem] tracking-[0.16em] text-rose-300 uppercase">Planned</span>
                <h3 className="mt-3 font-display text-2xl leading-snug text-paper-50">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-mist-400">{item.summary}</p>
                <TagList items={item.topics} className="mt-5" label="Topics" />
              </li>
            ))}
          </Reveal>
          </Spotlight>
        </section>
      </Container>
    </>
  );
}
