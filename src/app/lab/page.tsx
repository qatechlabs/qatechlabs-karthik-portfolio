import { labEntries, labStatusLabel } from "@/content";
import { LabGrid } from "@/components/lab/LabGrid";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Engineering Lab",
  description: "Personal engineering work in AI-augmented quality engineering, Playwright tooling, and business-outcome validation, labelled by status.",
  path: "/lab",
});

export default function LabPage() {
  return (
    <>
      <PageHeader
        eyebrow="Engineering Lab"
        title="Where I test ideas before I trust them."
        intro="Personal work in AI-augmented quality engineering and test tooling. Each entry is labelled honestly: explorations are explorations, and only public, inspectable work is marked published."
      />
      <Container className="py-16">
        <LabGrid entries={labEntries} labels={labStatusLabel} />
      </Container>
    </>
  );
}
