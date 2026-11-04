import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function NotFound() {
  return (
    <Container size="narrow" className="py-32">
      <Eyebrow>404</Eyebrow>
      <h1 className="mt-5 font-display text-headline text-paper-50">This page doesn&rsquo;t exist.</h1>
      <p className="mt-5 text-lg text-mist-300">The link may be out of date. The case studies are a good place to start.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/case-studies">View case studies</ButtonLink>
        <ButtonLink href="/" variant="secondary">
          Back to home
        </ButtonLink>
      </div>
    </Container>
  );
}
