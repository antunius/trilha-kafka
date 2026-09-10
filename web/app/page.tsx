import type { Metadata } from "next";
import { HomeProgress } from "@/components/HomeProgress";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `${SITE_NAME} — Kafka e arquitetura`,
  description: SITE_DESCRIPTION,
  path: "/",
  ogType: "website",
});

export default function HomePage() {
  return (
    <div className="wrap">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          description: SITE_DESCRIPTION,
          inLanguage: "pt-BR",
        }}
      />
      <header className="hero">
        <div className="eyebrow">Kafka · Arquitetura</div>
        <h1>Duas trilhas, em páginas curtas</h1>
        <p className="lede">
          Kafka e arquitetura de software no mesmo caderno visual. Cada tema abre
          numa página; o simulador da aula destranca a próxima. O progresso fica neste navegador.
        </p>
      </header>
      <HomeProgress />
      <footer>Next.js · Vercel · trilhas Kafka e Arquitetura.</footer>
    </div>
  );
}
