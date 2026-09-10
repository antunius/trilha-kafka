import type { Metadata } from "next";
import { Quiz } from "@/components/Quiz";
import { Pager } from "@/components/Pager";
import { VisitTracker } from "@/components/VisitTracker";
import { JsonLd } from "@/components/JsonLd";
import { GateWall } from "@/components/GateWall";
import { kafkaNav, kafkaSimulador, neighbors } from "@/lib/catalog";
import { articleJsonLd, pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import quiz from "@/data/kafka-quiz.json";
import Link from "next/link";

export const metadata: Metadata = pageMetadata({
  title: kafkaSimulador.title,
  description: kafkaSimulador.description,
  path: kafkaSimulador.path,
});

export default function KafkaQuizPage() {
  const { prev } = neighbors(kafkaNav, kafkaSimulador.path);
  return (
    <div className="wrap">
      <VisitTracker path={kafkaSimulador.path} />
      <JsonLd
        data={articleJsonLd({
          headline: kafkaSimulador.title,
          description: kafkaSimulador.description,
          url: `${SITE_URL}${kafkaSimulador.path}`,
        })}
      />
      <header className="hero">
        <p className="crumb">
          <Link href="/">Trilhas</Link> · <Link href="/kafka">Kafka</Link>
        </p>
        <div className="eyebrow">{kafkaSimulador.eyebrow}</div>
        <h1>{kafkaSimulador.title}</h1>
        <p className="lede">{kafkaSimulador.description}</p>
      </header>
      <GateWall path={kafkaSimulador.path} nav={kafkaNav}>
        <section id="simulador" className="week prose">
          <h2>Simulador de entrevista — 50 perguntas</h2>
          <p>
            Uma pergunta por vez, como na mesa. Você escolhe, a próxima aparece. Sem
            gabarito embaixo. No fim, só o mapa de temas.
          </p>
          <Quiz
            storeKey="trilha-kafka-quiz-v3"
            trackKey="kafka"
            topics={quiz.topics}
            questions={quiz.questions}
          />
        </section>
        <Pager prev={prev} />
      </GateWall>
      <footer>Trilha Kafka por tema, rumo a Tech Lead backend.</footer>
    </div>
  );
}
