import { isPending, site } from "@/content";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { PendingNote, VerifiedText } from "@/components/ui/Pending";
import { emailHref, resumeLink } from "@/lib/links";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description: `Contact ${site.name} about Senior SDET, Lead SDET, and Quality Engineering Architect roles.`,
  path: "/contact",
});

export default function ContactPage() {
  const email = emailHref();
  const linkedin = site.links.linkedin;
  const resume = resumeLink();

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Tell me about the role."
        intro="I'm open to senior roles where test architecture, delivery quality, and hands-on engineering all matter."
      />
      <Container className="grid gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <h2 className="font-mono text-[0.72rem] tracking-[0.18em] text-mist-500 uppercase">Reach me</h2>
          <ul className="mt-6 divide-y divide-paper-100/[0.08] border-y border-paper-100/[0.08]">
            <ContactRow label="Email">
              {email ? (
                <a href={email} className="text-paper-50 underline decoration-rose-500/60 underline-offset-4 hover:text-rose-200" data-testid="contact-email">
                  {String(site.links.email)}
                </a>
              ) : (
                <VerifiedText value={site.links.email} />
              )}
            </ContactRow>
            <ContactRow label="LinkedIn">
              {isPending(linkedin) ? (
                <PendingNote note={linkedin.note} />
              ) : (
                <a href={linkedin.href} target="_blank" rel="noopener noreferrer" className="text-paper-50 hover:text-rose-200">
                  {linkedin.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </ContactRow>
            <ContactRow label="GitHub">
              <a
                href={site.links.github.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-paper-50 underline decoration-rose-500/60 underline-offset-4 hover:text-rose-200"
                data-testid="contact-github"
              >
                github.com/karthik-testauro<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </ContactRow>
            <ContactRow label="Location">{site.location}</ContactRow>
            <ContactRow label="Availability">
              <VerifiedText value={site.workPreference} />
            </ContactRow>
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            {email ? <ButtonLink href={email}>Email me</ButtonLink> : null}
            <ButtonLink href={resume.href} download={resume.download} variant={email ? "secondary" : "primary"}>
              Download résumé
            </ButtonLink>
            <ButtonLink href={site.links.github.href} variant="secondary">
              View GitHub
            </ButtonLink>
          </div>
        </div>

        <aside className="rounded-[1.5rem] border border-rose-500/25 bg-gradient-to-br from-burgundy-900/70 to-navy-900 p-8 sm:p-10">
          <h2 className="font-display text-3xl text-paper-50">Roles I&rsquo;m looking for</h2>
          <ul className="mt-6 space-y-3">
            {site.openTo.map((role) => (
              <li key={role} className="flex gap-4 text-paper-100">
                <span aria-hidden="true" className="mt-[0.7rem] h-px w-4 shrink-0 bg-rose-400" />
                {role}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm leading-relaxed text-rose-100/75">
            Helpful to include: the team&rsquo;s product area, current test stack, and the quality problem you most
            want solved.
          </p>
        </aside>
      </Container>
    </>
  );
}

function ContactRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <li className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr] sm:items-baseline">
      <span className="font-mono text-[0.7rem] tracking-[0.16em] text-mist-500 uppercase">{label}</span>
      <span className="text-paper-100">{children}</span>
    </li>
  );
}
