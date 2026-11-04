import Link from "next/link";
import type { Capability, CaseStudy, Principle, Role } from "@/content";
import { CaseStudyCard } from "@/components/case-study/CaseStudyCard";
import { ArrowRight, ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TagList } from "@/components/ui/TagList";

export function CapabilitiesSection({ capabilities }: { capabilities: Capability[] }) {
  return (
    <section aria-labelledby="capabilities-title" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          id="capabilities-title"
          eyebrow="What I architect"
          title="Quality systems, from the first locator to the release decision."
          intro="Each layer produces evidence. Together they tell a team whether a build is ready."
        />
        <ul className="mt-16 grid gap-px overflow-hidden rounded-[1.5rem] border border-paper-100/[0.08] bg-paper-100/[0.08] md:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((capability, index) => (
            <li key={capability.title} className="flex flex-col bg-navy-900 p-8 sm:p-9">
              <span className="font-mono text-[0.7rem] tracking-[0.18em] text-rose-400/80" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-lg font-medium text-paper-50">{capability.title}</h3>
              <p className="mt-3 flex-1 leading-relaxed text-mist-300">{capability.summary}</p>
              <TagList items={capability.tools} className="mt-6" label={`${capability.title} tools`} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function FeaturedWork({ studies }: { studies: CaseStudy[] }) {
  return (
    <section aria-labelledby="work-title" className="py-24 sm:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            id="work-title"
            eyebrow="Featured case studies"
            title="Engineering decisions, explained."
            intro="Business problem, constraints, architecture, and what I would do again. Client details are sanitized."
          />
          <ButtonLink href="/case-studies" variant="secondary">
            All case studies <ArrowRight />
          </ButtonLink>
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {studies.map((study, index) => (
            <CaseStudyCard key={study.slug} study={study} index={index} size={index === 0 ? "large" : "default"} />
          ))}
        </div>
      </Container>
    </section>
  );
}

export function PrinciplesSection({ principles }: { principles: Principle[] }) {
  return (
    <section aria-labelledby="principles-title" className="relative overflow-hidden border-y border-paper-100/[0.07] bg-gradient-to-br from-burgundy-950 via-navy-950 to-navy-950 py-24 sm:py-32">
      <Container className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeading
          id="principles-title"
          eyebrow="How I work"
          title="Principles that hold up under release pressure."
        />
        <ol className="divide-y divide-paper-100/[0.08] border-y border-paper-100/[0.08]">
          {principles.map((principle, index) => (
            <li key={principle.title} className="grid gap-2 py-6 sm:grid-cols-[3rem_1fr]">
              <span className="font-display text-xl text-rose-400" aria-hidden="true">
                {index + 1}.
              </span>
              <div>
                <h3 className="font-medium text-paper-50">{principle.title}</h3>
                <p className="mt-1.5 leading-relaxed text-mist-300">{principle.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

export function CareerSnapshot({ roles }: { roles: Role[] }) {
  return (
    <section aria-labelledby="career-title" className="py-24 sm:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading id="career-title" eyebrow="Career" title="Five organisations, one through-line." />
          <ButtonLink href="/experience" variant="secondary">
            Full experience <ArrowRight />
          </ButtonLink>
        </div>
        <ol className="mt-14 grid gap-px overflow-hidden rounded-[1.5rem] border border-paper-100/[0.08] bg-paper-100/[0.08] sm:grid-cols-2 lg:grid-cols-5">
          {roles.map((role) => (
            <li key={role.slug} className="bg-navy-900 p-6">
              <p className="font-medium text-paper-50">{role.organisation}</p>
              {role.client ? <p className="mt-0.5 text-sm text-rose-300">Client: {role.client}</p> : null}
              <p className="mt-3 text-sm leading-relaxed text-mist-400">{role.summary}</p>
              <TagList items={role.stack.slice(0, 3)} className="mt-4" label={`${role.organisation} technologies`} />
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

export function ContactBand() {
  return (
    <section aria-labelledby="contact-band-title" className="pb-24 sm:pb-32">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-rose-500/25 bg-gradient-to-br from-burgundy-900 via-burgundy-950 to-navy-900 px-8 py-16 sm:px-14 sm:py-20">
          <div aria-hidden="true" className="hairline absolute inset-x-0 top-0" />
          <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 id="contact-band-title" className="font-display text-headline text-paper-50">
                Hiring a Lead SDET or Quality Engineering Architect?
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-rose-100/80">
                I&rsquo;m interested in senior roles where test architecture, delivery quality, and hands-on
                engineering all matter.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <ButtonLink href="/contact" testId="cta-contact-band">
                Get in touch <ArrowRight />
              </ButtonLink>
              <Link href="/about" className="inline-flex min-h-11 items-center px-4 text-sm text-paper-100 underline-offset-[6px] hover:underline">
                About me
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
