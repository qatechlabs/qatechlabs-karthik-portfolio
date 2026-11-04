import type { MetadataRoute } from "next";
import { caseStudies, site } from "@/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", ...site.nav.map((item) => item.href), "/resume"];
  return [
    ...staticRoutes.map((path) => ({
      url: `${site.url}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...caseStudies.map((study) => ({
      url: `${site.url}/case-studies/${study.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
