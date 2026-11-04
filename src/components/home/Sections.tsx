import Link from "next/link";
import type { Capability, CaseStudy, Principle, Role } from "@/content";
import { CaseStudyCard } from "@/components/case-study/CaseStudyCard";
import { ArrowRight, ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { Spotlight } from "@/components/motion/Spotlight";
import { TagList } from "@/components/ui/TagList";

export function CapabilitiesSection({ capabilities }: { capabilities: Capability[] }) {
  return (
    <section aria-labelledby="capabilities-title" className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            id="capabilities-title"
            eyebrow="What I architect"
            title="Quality systems, from the first locator to the release decision."
            intro="Each layer produces evidence. Together they tell a team whether a build is ready."
          />
        </Reveal>
        <Spotlight as="div" className="mt-16">
        <RevealGroup as="ul" itemAs="li" stagger={0.07} className="grid gap-px overflow-hidden rounded-[1.5rem] border border-paper-100/[0.08] bg-paper-100/[0.08] md:grid-cols-2 lg:grid-cols-3" itemClassName="flex">
          {capabilities.map((capability, index) => (
            <div key={capability.title} data-spotlight className="flex w-full flex-col bg-navy-900 p-8 transition-colors duration-300 hover:bg-navy-850 sm:p-9">
              <span className="font-mono text-[0.7rem] tracking-[0.18em] text-rose-400/80" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-lg font-medium text-paper-50">{capability.title}</h3>
              <p className="mt-3 flex-1 leading-relaxed text-mist-300">{capability.summary}</p>
              <TagList items={capability.tools} className="mt-6" label={`${capability.title} tools`} />
            </div>
          ))}
        </RevealGroup>
        </Spotlight>
      </Container>
    </section>
  );
}

export function FeaturedWork({ studies }: { studies: CaseStudy[] }) {
  return (
    <section aria-labelledby="work-title" className="py-24 sm:py-32">
      <Container>
        <Reveal className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            id="work-title"
            eyebrow="Featured case studies"
            title="Engineering decisions, explained."
            intro="Business problem, constraints, architecture, and what I would do again. Client details are sanitized."
          />
          <ButtonLink href="/case-studies" variant="secondary">
            All case studies <ArrowRight />
          </ButtonLink>
        </Reveal>
        <Spotlight className="mt-14 grid gap-6 lg:grid-cols-2">
          {studies.map((study, index) => (
            <Reveal key={study.slug} delay={index * 0.1} className={index === 0 ? "lg:col-span-2" : undefined}>
              <CaseStudyCard study={study} index={index} size={index === 0 ? "large" : "default"} />
            </Reveal>
          ))}
        </Spotlight>
      </Container>
    </section>
  );
}

export function PrinciplesSection({ principles }: { principles: Principle[] }) {
  return (
    <section aria-labelledby="principles-title" className="relative overflow-hidden border-y border-paper-100/[0.07] bg-gradient-to-br from-burgundy-950 via-navy-950 to-navy-950 py-24 sm:py-32">
      <Container className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            id="principles-title"
            eyebrow="How I work"
            title="Principles that hold up under release pressure."
          />
        </Reveal>
        <RevealGroup as="ol" itemAs="li" stagger={0.12} className="divide-y divide-paper-100/[0.08] border-y border-paper-100/[0.08]" itemClassName="group">
          {principles.map((principle, index) => (
            <div key={principle.title} className="grid gap-2 py-7 transition-transform duration-500 group-hover:translate-x-2 sm:grid-cols-[3rem_1fr]">
              <span className="font-display text-xl text-rose-400 transition-colors group-hover:text-rose-200" aria-hidden="true">
                {index + 1}.
              </span>
              <div>
                <h3 className="font-medium text-paper-50">{principle.title}</h3>
                <p className="mt-1.5 leading-relaxed text-mist-300">{principle.body}</p>
              </div>
            </div>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}

export function CareerSnapshot({ roles }: { roles: Role[] }) {
  return (
    <section aria-labelledby="career-title" className="py-24 sm:py-32">
      <Container>
        <Reveal className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading id="career-title" eyebrow="Career" title="Five organisations, one through-line." />
          <ButtonLink href="/experience" variant="secondary">
            Full experience <ArrowRight />
          </ButtonLink>
        </Reveal>
        <Spotlight className="mt-14">
        <RevealGroup as="ol" itemAs="li" stagger={0.08} className="grid gap-px overflow-hidden rounded-[1.5rem] border border-paper-100/[0.08] bg-paper-100/[0.08] sm:grid-cols-2 lg:grid-cols-5" itemClassName="flex">
          {roles.map((role) => (
            <div key={role.slug} data-spotlight className="w-full bg-navy-900 p-6 transition-colors duration-300 hover:bg-navy-850">
              <p className="font-medium text-paper-50">{role.organisation}</p>
              {role.client ? <p className="mt-0.5 text-sm text-rose-300">Client: {role.client}</p> : null}
              <p className="mt-3 text-sm leading-relaxed text-mist-400">{role.summary}</p>
              <TagList items={role.stack.slice(0, 3)} className="mt-4" label={`${role.organisation} technologies`} />
            </div>
          ))}
        </RevealGroup>
        </Spotlight>
      </Container>
    </section>
  );
}

export function ContactBand() {
  return (
    <section aria-labelledby="contact-band-title" className="pb-24 sm:pb-32">
      <Container>
        <Reveal>
        <div data-spotlight className="relative overflow-hidden rounded-[2rem] border border-rose-500/25 bg-gradient-to-br from-burgundy-900 via-burgundy-950 to-navy-900 px-8 py-16 sm:px-14 sm:py-20">
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
              <Magnetic>
                <ButtonLink href="/contact" testId="cta-contact-band">
                  Get in touch <ArrowRight />
                </ButtonLink>
              </Magnetic>
              <Link href="/about" className="inline-flex min-h-11 items-center px-4 text-sm text-paper-100 underline-offset-[6px] hover:underline">
                About me
              </Link>
            </div>
          </div>
        </div>
        </Reveal>
      </Container>
    </section>
  );
}
