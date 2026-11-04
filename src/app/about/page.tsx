import { about, principles, site, skills } from "@/content";
import { ArrowRight, ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { PendingNote } from "@/components/ui/Pending";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageMetadata } from "@/lib/seo";
import { isPending } from "@/content";

export const metadata = pageMetadata({
  title: "About",
  description: `${site.name}: ${site.yearsOfExperience} years in quality engineering, from framework architecture to AI-augmented testing.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About" title="Quality engineering, treated as engineering." intro={about.intro} />

      <Container className="grid gap-14 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:py-28">
        <div>
          <div className="sticky top-28">
            <div className="bg-blueprint flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[1.5rem] border border-paper-100/10 bg-navy-900 p-6">
              {isPending(about.portrait) ? <PendingNote note={about.portrait.note} /> : null}
            </div>
            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between gap-4 border-b border-paper-100/[0.07] pb-3">
                <dt className="text-mist-500">Location</dt>
                <dd className="text-paper-100">{site.location}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-paper-100/[0.07] pb-3">
                <dt className="text-mist-500">Experience</dt>
                <dd className="text-paper-100">{site.yearsOfExperience} years</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-paper-100/[0.07] pb-3">
                <dt className="text-mist-500">Focus</dt>
                <dd className="text-right text-paper-100">Test architecture, AI-augmented QE</dd>
              </div>
            </dl>
          </div>
        </div>

        <div>
          <div className="prose-body max-w-2xl text-lg leading-relaxed text-mist-300">
            {about.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <section aria-labelledby="approach-title" className="mt-20">
            <SectionHeading id="approach-title" eyebrow="Approach" title="How I approach a quality problem." />
            <ol className="mt-10 grid gap-px overflow-hidden rounded-[1.25rem] border border-paper-100/[0.08] bg-paper-100/[0.08] sm:grid-cols-2">
              {about.approach.map((item, index) => (
                <li key={item.title} className="bg-navy-900 p-6">
                  <span className="font-mono text-[0.7rem] text-rose-400" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-medium text-paper-50">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist-400">{item.body}</p>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="principles-title" className="mt-20">
            <SectionHeading id="principles-title" eyebrow="Principles" title="What I hold to." />
            <ul className="mt-8 space-y-4">
              {principles.map((principle) => (
                <li key={principle.title} className="border-l border-rose-500/50 pl-5">
                  <p className="font-medium text-paper-50">{principle.title}</p>
                  <p className="mt-1 text-mist-300">{principle.body}</p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="skills-title" className="mt-20">
            <SectionHeading id="skills-title" eyebrow="Toolkit" title="Technologies I work with." />
            <dl className="mt-8 divide-y divide-paper-100/[0.08] border-y border-paper-100/[0.08]">
              {skills.map((group) => (
                <div key={group.area} className="grid gap-2 py-5 sm:grid-cols-[13rem_1fr]">
                  <dt className="font-mono text-[0.72rem] tracking-[0.16em] text-mist-500 uppercase">{group.area}</dt>
                  <dd className="text-paper-100">{group.items.join(" · ")}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="mt-16 flex flex-wrap gap-3">
            <ButtonLink href="/experience">
              View experience <ArrowRight />
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Get in touch
            </ButtonLink>
          </div>
        </div>
      </Container>
    </>
  );
}
