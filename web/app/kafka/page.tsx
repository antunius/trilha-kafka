import type { Metadata } from "next";
import { TrackHome } from "@/components/TrackHome";
import { kafkaHome } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: kafkaHome.title,
  description: kafkaHome.description,
  path: kafkaHome.path,
  ogType: "website",
});

export default function KafkaIndexPage() {
  return (
    <TrackHome
      path="/kafka"
      num="04"
      eyebrow={kafkaHome.eyebrow}
      title={kafkaHome.title}
      lede={kafkaHome.description}
      courseName="Trilha Apache Kafka"
      footer="Trilha Kafka por tema, rumo a Tech Lead backend."
      cards={[
        {
          href: "/kafka/modelo-mental",
          tag: "Comece aqui",
          title: "Modelo mental",
          blurb: "Fila vs caderno, depois um simulador de 5 perguntas.",
        },
        {
          href: "/kafka/evento",
          tag: "Conceitos",
          title: "Do evento ao Spring",
          blurb: "Uma página por tema. A próxima só abre com 4 de 5.",
        },
        {
          href: "/kafka/tech-lead",
          tag: "Lead",
          title: "Virar referência",
          blurb: "Contrato, operação e saber dizer não.",
        },
        {
          href: "/kafka/simulador",
          tag: "Mesa",
          title: "Simulador · 50 perguntas",
          blurb: "Destrava no fim da trilha. Uma por vez, com mapa de gaps.",
        },
      ]}
    />
  );
}
