import { caseStudies } from "@/content";
import { CaseStudyCard } from "@/components/case-study/CaseStudyCard";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Case Studies",
  description:
    "Technical case studies: a tenant-aware Playwright framework for global Workday, Kafka event-stream validation for financial systems, an automation transformation, and mobile release quality.",
  path: "/case-studies",
});

export default function CaseStudiesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Case studies"
        title="How the systems were designed, and why."
        intro="Each study covers the business problem, constraints, architecture, decisions, and outcomes. Client details are sanitized, and illustrative code is synthetic."
      />
      <Container className="py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          {caseStudies.map((study, index) => (
            <CaseStudyCard key={study.slug} study={study} index={index} headingLevel="h2" />
          ))}
        </div>
      </Container>
    </>
  );
}
