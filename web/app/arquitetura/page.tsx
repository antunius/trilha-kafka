import type { Metadata } from "next";
import { TrackHome } from "@/components/TrackHome";
import { arquiteturaHome } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: arquiteturaHome.title,
  description: arquiteturaHome.description,
  path: arquiteturaHome.path,
  ogType: "website",
});

export default function ArquiteturaIndexPage() {
  return (
    <TrackHome
      path="/arquitetura"
      num="07"
      eyebrow={arquiteturaHome.eyebrow}
      title={arquiteturaHome.title}
      lede={arquiteturaHome.description}
      courseName="Trilha Arquitetura e Microsserviços"
      footer="Trilha de Arquitetura por tema, rumo a Arquiteto de Software."
      cards={[
        {
          href: "/arquitetura/mapa",
          tag: "Comece aqui",
          title: "Mapa",
          blurb: "Ideia central, currículo, vocabulário do zero.",
        },
        {
          href: "/arquitetura/sistema",
          tag: "Conceitos",
          title: "Do sistema ao SLO",
          blurb: "Uma página por tema. A próxima só abre com 4 de 5.",
        },
        {
          href: "/arquitetura/staff",
          tag: "Staff",
          title: "Big tech e catálogo",
          blurb: "Células, cache em camadas, LSM, rate limit, comentários.",
        },
        {
          href: "/arquitetura/simulador",
          tag: "Mesa",
          title: "Simulador · 60 perguntas",
          blurb: "Destrava no fim da trilha. Uma por vez, com mapa de gaps.",
        },
      ]}
    />
  );
}
