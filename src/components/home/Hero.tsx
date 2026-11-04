import { confidenceStack, site } from "@/content";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { SplitWords } from "@/components/motion/SplitWords";
import { Spotlight } from "@/components/motion/Spotlight";
import { ArrowRight, ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { resumeLink } from "@/lib/links";
import { ConfidenceStack } from "./ConfidenceStack";

export function Hero() {
  const resume = resumeLink();
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <Spotlight className="spotlight-hero relative">
        <div aria-hidden="true" className="bg-blueprint absolute inset-0" />
        <div aria-hidden="true" className="hero-orbit pointer-events-none absolute -top-40 right-[-10rem] size-[42rem] rounded-full" />
        <Container className="relative grid items-center gap-14 pt-16 pb-20 sm:pt-24 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pt-28 lg:pb-28">
          <div>
            <Reveal>
              <Eyebrow>
                {site.name} · {site.brand}
              </Eyebrow>
            </Reveal>
            <h1 id="hero-title" className="mt-6 font-display text-display font-normal tracking-tight text-paper-50">
              <SplitWords text="I architect the systems that let teams" delay={0.1} />{" "}
              <em className="text-rose-300 italic">
                <SplitWords text="release with confidence." delay={0.55} wordClassName="shimmer-text" />
              </em>
            </h1>
            <Reveal delay={0.5}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-mist-300">
                {site.role} and Senior SDET with {site.yearsOfExperience} years in enterprise test automation:
                Playwright and TypeScript frameworks for global Workday, Kafka event validation for financial
                systems, CI/CD quality gates, and mobile. Now combining deterministic automation with responsible
                AI.
              </p>
            </Reveal>

            <Reveal delay={0.7}>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Magnetic>
                  <ButtonLink href="/case-studies" testId="cta-explore">
                    Explore my work <ArrowRight />
                  </ButtonLink>
                </Magnetic>
                <Magnetic strength={0.18}>
                  <ButtonLink href={site.links.github.href} variant="secondary" testId="cta-github">
                    View GitHub
                  </ButtonLink>
                </Magnetic>
                <Magnetic strength={0.18}>
                  <ButtonLink href={resume.href} download={resume.download} variant="secondary" testId="cta-resume">
                    Download résumé
                  </ButtonLink>
                </Magnetic>
                <ButtonLink href="/contact" variant="ghost" className="ml-1" testId="cta-contact">
                  Get in touch
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal delay={0.85}>
              <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-paper-100/[0.08] pt-6 text-sm">
                <div>
                  <dt className="font-mono text-[0.68rem] tracking-[0.18em] text-mist-500 uppercase">Based in</dt>
                  <dd className="mt-1 text-paper-100">{site.location}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.68rem] tracking-[0.18em] text-mist-500 uppercase">Open to</dt>
                  <dd className="mt-1 text-paper-100">Senior SDET, Lead SDET, QE Architect roles</dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <ConfidenceStack layers={confidenceStack} />
        </Container>
        <ScrollCue />
      </Spotlight>
    </section>
  );
}

function ScrollCue() {
  return (
    <div aria-hidden="true" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block">
      <span className="flex h-10 w-6 justify-center rounded-full border border-paper-100/20 pt-2">
        <span className="scroll-cue-dot size-1 rounded-full bg-rose-300" />
      </span>
    </div>
  );
}
