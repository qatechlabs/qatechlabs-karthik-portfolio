import type { Metadata } from "next";
import { site } from "@/content";

type PageMeta = {
  title: string;
  description: string;
  path: `/${string}` | "/";
};

/** Consistent per-page metadata with canonical URL and Open Graph fields. */
export function pageMetadata({ title, description, path }: PageMeta): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} · ${site.name}`,
      description,
      url: path,
      siteName: site.name,
      type: "website",
      locale: "en_GB",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${site.name}`,
      description,
    },
  };
}
