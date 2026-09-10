import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "./site";

export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article";
}): Metadata {
  const url = `${SITE_URL}${opts.path}`;
  const title =
    opts.path === "/"
      ? { absolute: opts.title }
      : opts.title;
  return {
    title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      locale: "pt_BR",
      type: opts.ogType ?? "article",
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary",
      title: opts.title,
      description: opts.description,
    },
  };
}

export function courseJsonLd(opts: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    inLanguage: "pt-BR",
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

export function articleJsonLd(opts: {
  headline: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    inLanguage: "pt-BR",
    author: { "@type": "Organization", name: SITE_NAME },
  };
}
