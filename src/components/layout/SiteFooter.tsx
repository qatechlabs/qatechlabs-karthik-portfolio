import Link from "next/link";
import { isPending, site } from "@/content";
import { Container } from "@/components/ui/Container";
import { emailHref, resumeLink } from "@/lib/links";

export function SiteFooter() {
  const email = emailHref();
  const linkedin = site.links.linkedin;
  const resume = resumeLink();

  return (
    <footer className="no-print mt-auto border-t border-paper-100/[0.07] bg-ink/60">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl text-paper-50">{site.brand}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-mist-400">
            {site.name} · {site.role} · {site.location}
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="font-mono text-[0.7rem] tracking-[0.2em] text-mist-500 uppercase">Site</p>
          <ul className="mt-4 grid grid-cols-2 gap-y-2 text-sm md:grid-cols-1">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-mist-300 hover:text-paper-50">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/resume" className="text-mist-300 hover:text-paper-50">
                Résumé
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="font-mono text-[0.7rem] tracking-[0.2em] text-mist-500 uppercase">Elsewhere</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={site.links.github.href} target="_blank" rel="noopener noreferrer" className="text-mist-300 hover:text-paper-50">
                GitHub<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            {!isPending(linkedin) ? (
              <li>
                <a href={linkedin.href} target="_blank" rel="noopener noreferrer" className="text-mist-300 hover:text-paper-50">
                  LinkedIn<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ) : null}
            {email ? (
              <li>
                <a href={email} className="text-mist-300 hover:text-paper-50">
                  Email
                </a>
              </li>
            ) : null}
            <li>
              <a href={resume.href} className="text-mist-300 hover:text-paper-50">
                {resume.download ? "Download résumé (PDF)" : "Printable résumé"}
              </a>
            </li>
          </ul>
        </div>
      </Container>
      <Container className="flex flex-col gap-2 border-t border-paper-100/[0.06] py-6 text-xs text-mist-500 sm:flex-row sm:justify-between">
        <p>© {site.name}. All rights reserved.</p>
        <p>Client work is described without confidential data, code, or internal architecture.</p>
      </Container>
    </footer>
  );
}
