import { confidenceStack, site } from "@/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ConfidenceStack } from "./ConfidenceStack";

/** The confidence stack, executing L01 → L06, with the one-paragraph summary. */
export function StackSection() {
  return (
    <section aria-labelledby="stack-title" className="relative overflow-hidden">
      <div aria-hidden="true" className="bg-blueprint absolute inset-0" />
      <Container className="relative grid items-center gap-14 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-28">
        <div>
          <Eyebrow>{site.brand}</Eyebrow>
          <h2 id="stack-title" className="mt-6 font-display text-headline font-normal tracking-tight text-paper-50">
            I architect the systems that let teams <em className="text-rose-300 italic">release with confidence.</em>
          </h2>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-mist-300">
            {site.role} and Senior SDET with {site.yearsOfExperience} years in enterprise test automation: Playwright and
            TypeScript frameworks for global Workday, Kafka event validation for financial systems, CI/CD quality gates,
            and mobile. Now combining deterministic automation with responsible AI.
          </p>
        </div>
        <ConfidenceStack layers={confidenceStack} />
      </Container>
    </section>
  );
}
