import type { Metadata } from "next";
import { Quiz } from "@/components/Quiz";
import { Pager } from "@/components/Pager";
import { VisitTracker } from "@/components/VisitTracker";
import { JsonLd } from "@/components/JsonLd";
import { GateWall } from "@/components/GateWall";
import { arquiteturaNav, arquiteturaSimulador, neighbors } from "@/lib/catalog";
import { articleJsonLd, pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import quiz from "@/data/arquitetura-quiz.json";
import Link from "next/link";

export const metadata: Metadata = pageMetadata({
  title: arquiteturaSimulador.title,
  description: arquiteturaSimulador.description,
  path: arquiteturaSimulador.path,
});

export default function ArquiteturaQuizPage() {
  const { prev } = neighbors(arquiteturaNav, arquiteturaSimulador.path);
  return (
    <div className="wrap">
      <VisitTracker path={arquiteturaSimulador.path} />
      <JsonLd
        data={articleJsonLd({
          headline: arquiteturaSimulador.title,
          description: arquiteturaSimulador.description,
          url: `${SITE_URL}${arquiteturaSimulador.path}`,
        })}
      />
      <header className="hero">
        <p className="crumb">
          <Link href="/">Trilhas</Link> · <Link href="/arquitetura">Arquitetura</Link>
        </p>
        <div className="eyebrow">{arquiteturaSimulador.eyebrow}</div>
        <h1>{arquiteturaSimulador.title}</h1>
        <p className="lede">{arquiteturaSimulador.description}</p>
      </header>
      <GateWall path={arquiteturaSimulador.path} nav={arquiteturaNav}>
        <section id="simulador" className="week prose">
          <h2>Simulador de entrevista — 60 perguntas</h2>
          <p>
            Uma pergunta por vez, como na mesa. Sem gabarito embaixo. No fim, só o mapa
            de temas.
          </p>
          <Quiz
            storeKey="trilha-arquitetura-quiz-v3"
            trackKey="arquitetura"
            topics={quiz.topics}
            questions={quiz.questions}
          />
        </section>
        <Pager prev={prev} />
      </GateWall>
      <footer>Trilha de Arquitetura por tema, rumo a Arquiteto de Software.</footer>
    </div>
  );
}
