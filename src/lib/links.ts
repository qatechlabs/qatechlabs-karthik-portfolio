import { isPending, site } from "@/content";

/** Résumé CTA target: the PDF when supplied, otherwise the printable page. */
export function resumeLink(): { href: string; download: boolean } {
  const pdf = site.links.resumePdf;
  return isPending(pdf) ? { href: "/resume", download: false } : { href: pdf, download: true };
}

/** mailto link when a verified email exists. */
export function emailHref(): string | null {
  const email = site.links.email;
  return isPending(email) ? null : `mailto:${email}`;
}
