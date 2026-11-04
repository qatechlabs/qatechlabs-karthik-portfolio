import { ScrollHero } from "@/components/hero/ScrollHero";
import { resumeLink } from "@/lib/links";

/** The opening: a pinned, scroll-scrubbed 360° hero. */
export function Hero() {
  return <ScrollHero resume={resumeLink()} />;
}
