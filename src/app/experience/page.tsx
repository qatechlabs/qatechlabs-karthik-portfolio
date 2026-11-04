import Link from "next/link";
import { credentials, isPending, roles, site } from "@/content";
import { ArrowRight, ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { PendingNote, VerifiedText } from "@/components/ui/Pending";
import { TagList } from "@/components/ui/TagList";
import { resumeLink } from "@/lib/links";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Experience",
  description: `Career timeline for ${site.name}: Zensar Technologies, Mphasis (JPMorgan Chase), SMARTnCODE, Exaze, and Progment.`,
  path: "/experience",
});

export default function ExperiencePage() {
  const resume = resumeLink();
  return (
    <>
      <PageHeader
        eyebrow="Experience"
        title={`${site.yearsOfExperience} years across enterprise, finance, and mobile.`}
        intro="From hands-on engineering to QA leadership, with framework architecture as the constant."
      >
        <ButtonLink href={resume.href} download={resume.download} variant="secondary">
          Download résumé
        </ButtonLink>
      </PageHeader>

      <Container className="py-20 lg:py-28">
        <ol className="relative" data-testid="timeline">
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-[0.45rem] w-px bg-gradient-to-b from-rose-400 via-paper-100/15 to-transparent md:left-[13.45rem]" />
          {roles.map((role) => (
            <li key={role.slug} className="relative grid gap-4 pb-16 pl-10 last:pb-0 md:grid-cols-[12rem_1fr] md:gap-12 md:pl-0">
              <span aria-hidden="true" className="absolute top-2 left-0 size-[0.95rem] rounded-full border border-rose-400 bg-navy-950 md:left-[13rem]" />
              <div className="md:pt-1 md:text-right">
                <p className="font-mono text-[0.72rem] tracking-[0.12em] text-mist-400">
                  <VerifiedText value={role.period} />
                </p>
              </div>
              <div className="md:pl-8">
                <h2 className="font-display text-[2rem] leading-tight text-paper-50">{role.organisation}</h2>
                {role.client ? <p className="mt-1 text-rose-300">Client: {role.client}</p> : null}
                <p className="mt-2 text-paper-100">
                  <VerifiedText value={role.title} />
                </p>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-mist-300">{role.summary}</p>
                <ul className="mt-5 max-w-2xl space-y-2.5">
                  {role.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-4 text-mist-300">
                      <span aria-hidden="true" className="mt-[0.7rem] h-px w-4 shrink-0 bg-rose-500" />
                      {highlight}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <TagList items={role.stack} label={`${role.organisation} technologies`} />
                  {role.caseStudy ? (
                    <Link href={`/case-studies/${role.caseStudy}`} className="inline-flex items-center gap-2 text-sm text-rose-300 hover:text-rose-200">
                      Read the case study <ArrowRight />
                    </Link>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ol>

        <section aria-labelledby="credentials-title" className="mt-24 rounded-[1.25rem] border border-paper-100/[0.08] bg-navy-900/60 p-8">
          <h2 id="credentials-title" className="font-display text-2xl text-paper-50">
            Certifications and education
          </h2>
          <div className="mt-4">{isPending(credentials) ? <PendingNote note={credentials.note} /> : null}</div>
        </section>
      </Container>
    </>
  );
}
