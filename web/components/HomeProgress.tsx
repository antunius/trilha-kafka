"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadProgress, trackProgress } from "@/lib/progress";
import { arquiteturaNav, kafkaNav } from "@/lib/catalog";

export function HomeProgress() {
  const [ready, setReady] = useState(false);
  const [last, setLast] = useState<string | undefined>();
  const [kafka, setKafka] = useState({ done: 0, total: 1, pct: 0 });
  const [arq, setArq] = useState({ done: 0, total: 1, pct: 0 });

  useEffect(() => {
    const p = loadProgress();
    setLast(p.lastPath);
    setKafka(trackProgress("/kafka", kafkaNav.map((n) => n.href)));
    setArq(trackProgress("/arquitetura", arquiteturaNav.map((n) => n.href)));
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <>
      {last ? (
        <p className="continue">
          Continuar de onde parou: <Link href={last}>{last}</Link>
        </p>
      ) : null}
      <div className="home-grid">
        <TrackCard
          href="/kafka"
          track="kafka"
          num="04"
          tag="Trilha 4 · Kafka"
          title="Apache Kafka"
          blurb="Uma página por tema, simulador de 5 perguntas e mesa de 50 no fim."
          pct={kafka.pct}
          done={kafka.done}
          total={kafka.total}
        />
        <TrackCard
          href="/arquitetura"
          track="arquitetura"
          num="07"
          tag="Trilha 7 · Arquitetura"
          title="Arquitetura"
          blurb="Mapa, system design, nível Staff e simulador de 60 perguntas."
          pct={arq.pct}
          done={arq.done}
          total={arq.total}
        />
      </div>
    </>
  );
}

function TrackCard({
  href,
  track,
  num,
  tag,
  title,
  blurb,
  pct,
  done,
  total,
}: {
  href: string;
  track: "kafka" | "arquitetura";
  num: string;
  tag: string;
  title: string;
  blurb: string;
  pct: number;
  done: number;
  total: number;
}) {
  return (
    <Link className="home-card" href={href} data-track={track}>
      <div className="num" aria-hidden="true">
        {num}
      </div>
      <div className="tag">{tag}</div>
      <h2>{title}</h2>
      <p>{blurb}</p>
      <div className="home-progress">
        <div className="bar">
          <i style={{ width: `${pct}%` }} />
        </div>
        <p>
          {done} de {total} aulas com simulador concluído
        </p>
      </div>
    </Link>
  );
}
