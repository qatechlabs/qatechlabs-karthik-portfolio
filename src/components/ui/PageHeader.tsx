import type { ReactNode } from "react";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";

/** Standard header for interior pages. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-paper-100/[0.07]">
      <div aria-hidden="true" className="bg-blueprint absolute inset-0 opacity-70" />
      <Container className="relative pt-20 pb-16 sm:pt-28 sm:pb-20">
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} intro={intro} className="animate-rise" />
        {children ? <div className="mt-10">{children}</div> : null}
      </Container>
    </header>
  );
}
