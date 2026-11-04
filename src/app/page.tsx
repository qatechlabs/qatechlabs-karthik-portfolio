import { capabilities, featuredCaseStudies, principles, roles, site, stats } from "@/content";
import { walkthrough } from "@/content/walkthrough";
import { Hero } from "@/components/home/Hero";
import { CapabilitiesSection, CareerSnapshot, ContactBand, FeaturedWork, PrinciplesSection } from "@/components/home/Sections";
import { StatsBand } from "@/components/home/StatsBand";
import { StackSection } from "@/components/home/StackSection";
import { Walkthrough } from "@/components/walkthrough/Walkthrough";
import { Guide } from "@/components/guide/Guide";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  url: site.url,
  address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressCountry: "IN" },
  sameAs: [site.links.github.href],
  knowsAbout: ["Test automation", "Playwright", "TypeScript", "Quality engineering", "CI/CD", "Kafka", "Workday"],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <Hero />
      <StackSection />
      <Walkthrough scenes={walkthrough} />
      <StatsBand stats={stats} />
      <FeaturedWork studies={featuredCaseStudies} />
      <CapabilitiesSection capabilities={capabilities} />
      <PrinciplesSection principles={principles} />
      <CareerSnapshot roles={roles} />
      <ContactBand />
      <Guide />
    </>
  );
}
