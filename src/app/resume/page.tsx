import { capabilities, isPending, roles, site, skills } from "@/content";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { PendingNote, VerifiedText } from "@/components/ui/Pending";
import { PrintButton } from "@/components/ui/PrintButton";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Résumé",
  description: `Résumé of ${site.name}, ${site.role}.`,
  path: "/resume",
});

export default function ResumePage() {
  const pdf = site.links.resumePdf;
  return (
    <Container size="narrow" className="py-16 sm:py-24">
      <div className="no-print mb-10 flex flex-wrap items-center gap-3">
        {isPending(pdf) ? (
          <>
            <PrintButton />
            <PendingNote note={pdf.note} />
          </>
        ) : (
          <ButtonLink href={pdf} download>
            Download PDF
          </ButtonLink>
        )}
      </div>

      <article className="rounded-[1.25rem] border border-paper-100/[0.08] bg-navy-900/60 p-8 sm:p-12 print:border-0 print:bg-white print:p-0 print:text-black">
        <header className="border-b border-paper-100/10 pb-8 print:border-black/20">
          <h1 className="font-display text-5xl text-paper-50 print:text-black">{site.name}</h1>
          <p className="mt-2 text-lg text-rose-300 print:text-black">{site.roles.join(" · ")}</p>
          <p className="mt-3 text-sm text-mist-400 print:text-black">
            {site.location} · {site.links.github.href.replace("https://", "")}
            {!isPending(site.links.email) ? ` · ${site.links.email}` : null}
          </p>
        </header>

        <section className="mt-8" aria-labelledby="r-summary">
          <h2 id="r-summary" className="font-mono text-[0.72rem] tracking-[0.18em] text-mist-500 uppercase print:text-black">Summary</h2>
          <p className="mt-3 leading-relaxed text-mist-300 print:text-black">{site.description}</p>
        </section>

        <section className="mt-10" aria-labelledby="r-experience">
          <h2 id="r-experience" className="font-mono text-[0.72rem] tracking-[0.18em] text-mist-500 uppercase print:text-black">Experience</h2>
          <ol className="mt-4 space-y-8">
            {roles.map((role) => (
              <li key={role.slug} className="break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-medium text-paper-50 print:text-black">
                    {role.organisation}
                    {role.client ? <span className="font-normal text-mist-400 print:text-black"> · Client: {role.client}</span> : null}
                  </h3>
                  <span className="font-mono text-xs text-mist-400">
                    <VerifiedText value={role.period} />
                  </span>
                </div>
                <p className="mt-1 text-sm text-rose-300 print:text-black">
                  <VerifiedText value={role.title} />
                </p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-mist-300 marker:text-rose-500 print:text-black">
                  {role.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10" aria-labelledby="r-capabilities">
          <h2 id="r-capabilities" className="font-mono text-[0.72rem] tracking-[0.18em] text-mist-500 uppercase print:text-black">Capabilities</h2>
          <p className="mt-3 text-sm leading-relaxed text-mist-300 print:text-black">{capabilities.map((c) => c.title).join(" · ")}</p>
        </section>

        <section className="mt-10" aria-labelledby="r-skills">
          <h2 id="r-skills" className="font-mono text-[0.72rem] tracking-[0.18em] text-mist-500 uppercase print:text-black">Technical skills</h2>
          <dl className="mt-3 space-y-2 text-sm">
            {skills.map((group) => (
              <div key={group.area} className="grid gap-1 sm:grid-cols-[11rem_1fr]">
                <dt className="text-mist-400 print:text-black">{group.area}</dt>
                <dd className="text-paper-100 print:text-black">{group.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>
      </article>
    </Container>
  );
}
