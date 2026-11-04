import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy, isPending } from "@/content";
import { CaseStudyBody, sectionsFor } from "@/components/case-study/CaseStudyBody";
import { ArrowRight, ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { VerifiedText } from "@/components/ui/Pending";
import { TagList } from "@/components/ui/TagList";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return pageMetadata({ title: study.title, description: study.summary, path: `/case-studies/${study.slug}` });
}

export default async function CaseStudyPage({ params }: PageProps<"/case-studies/[slug]">) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const index = caseStudies.findIndex((item) => item.slug === study.slug);
  const next = caseStudies[(index + 1) % caseStudies.length];
  const sections = sectionsFor(study);

  return (
    <article>
      <header className="relative overflow-hidden border-b border-paper-100/[0.07]">
        <div aria-hidden="true" className="bg-blueprint absolute inset-0 opacity-70" />
        <Container className="relative pt-16 pb-16 sm:pt-24 sm:pb-20">
          <nav aria-label="Breadcrumb" className="text-sm text-mist-400">
            <Link href="/case-studies" className="hover:text-paper-50">
              Case studies
            </Link>
            <span aria-hidden="true" className="mx-2 text-mist-500">/</span>
            <span aria-current="page" className="text-mist-300">{study.organisation}</span>
          </nav>
          <div className="animate-rise mt-10 max-w-4xl">
            <Eyebrow>
              Case study {String(index + 1).padStart(2, "0")} · {study.domain}
            </Eyebrow>
            <h1 className="mt-5 font-display text-headline text-paper-50 sm:text-[3.6rem] sm:leading-[1.05]">{study.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mist-300">{study.summary}</p>
          </div>

          <dl className="mt-12 grid gap-6 border-t border-paper-100/[0.08] pt-8 sm:grid-cols-2 lg:grid-cols-4">
            <Meta label="Organisation">
              {study.organisation}
              {study.client ? <span className="block text-sm text-rose-300">Client: {study.client}</span> : null}
            </Meta>
            <Meta label="Role">
              <VerifiedText value={study.role} />
            </Meta>
            <Meta label="Period">
              <VerifiedText value={study.period} />
            </Meta>
            <Meta label="Stack">
              <TagList items={study.stack} label="Stack" className="text-[0.78rem] text-paper-100" />
            </Meta>
          </dl>
          {study.headline ? (
            <p className="mt-8 border-l border-rose-500/60 pl-4 text-rose-200">
              <VerifiedText value={study.headline} />
            </p>
          ) : null}
        </Container>
      </header>

      <Container className="grid grid-cols-1 gap-12 py-16 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16 lg:py-20">
        <aside className="no-print hidden lg:block">
          <nav aria-label="On this page" className="sticky top-28">
            <p className="font-mono text-[0.68rem] tracking-[0.18em] text-mist-500 uppercase">On this page</p>
            <ol className="mt-4 space-y-2 border-l border-paper-100/[0.08] text-sm">
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="-ml-px block border-l border-transparent pl-4 text-mist-400 hover:border-rose-400 hover:text-paper-50">
                    {section.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <div className="min-w-0 max-w-3xl">
          <CaseStudyBody study={study} />

          <section aria-labelledby="repo-title" className="mt-4 rounded-xl border border-paper-100/[0.08] bg-navy-900/60 p-6">
            <h2 id="repo-title" className="font-mono text-[0.7rem] tracking-[0.18em] text-mist-500 uppercase">
              Repository and confidentiality
            </h2>
            <div className="mt-3">
              {isPending(study.repository) ? (
                <VerifiedText value={study.repository} />
              ) : (
                <ButtonLink href={study.repository.href} variant="secondary">
                  {study.repository.label}
                </ButtonLink>
              )}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-mist-400">{study.confidentiality}</p>
          </section>
        </div>
      </Container>

      <Container className="pb-24">
        <Link
          href={`/case-studies/${next.slug}`}
          className="group flex flex-col gap-3 rounded-[1.5rem] border border-paper-100/[0.08] bg-gradient-to-r from-navy-900 to-burgundy-950 p-8 transition-colors hover:border-rose-500/40 sm:flex-row sm:items-center sm:justify-between sm:p-10"
          data-testid="next-case-study"
        >
          <span>
            <span className="block font-mono text-[0.7rem] tracking-[0.18em] text-mist-500 uppercase">Next case study</span>
            <span className="mt-2 block font-display text-2xl text-paper-50 sm:text-3xl">{next.title}</span>
          </span>
          <ArrowRight className="size-6 text-rose-300 transition-transform group-hover:translate-x-1" />
        </Link>
      </Container>
    </article>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-mono text-[0.68rem] tracking-[0.18em] text-mist-500 uppercase">{label}</dt>
      <dd className="mt-2 text-paper-100">{children}</dd>
    </div>
  );
}
