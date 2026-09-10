"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadProgress, saveProgress } from "@/lib/progress";

export type Topic = { name: string; href: string };
export type Question = { t: string; q: string; o: string[]; a: number; w: string };

type QuizState = { a: Record<string, number>; i: number };

function empty(): QuizState {
  return { a: {}, i: 0 };
}

export function Quiz({
  storeKey,
  trackKey,
  topics,
  questions,
}: {
  storeKey: string;
  trackKey: string;
  topics: Record<string, Topic>;
  questions: Question[];
}) {
  const [state, setState] = useState<QuizState>(empty);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(storeKey) || "null");
      if (raw?.a && typeof raw.i === "number") setState({ a: raw.a, i: raw.i });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [storeKey]);

  function persist(next: QuizState) {
    setState(next);
    localStorage.setItem(storeKey, JSON.stringify(next));
  }

  if (!hydrated) {
    return <p className="quiz-meta">Carregando o simulador…</p>;
  }

  const done = state.i >= questions.length;
  const answered = Object.keys(state.a).length;
  const bar = Math.round((answered / questions.length) * 100);

  if (done) {
    const byTopic: Record<string, { ok: number; total: number }> = {};
    Object.keys(topics).forEach((k) => {
      byTopic[k] = { ok: 0, total: 0 };
    });
    let score = 0;
    questions.forEach((item, i) => {
      byTopic[item.t].total += 1;
      if (Number(state.a[i]) === item.a) {
        score += 1;
        byTopic[item.t].ok += 1;
      }
    });
    const rows = Object.keys(topics)
      .map((k) => {
        const t = byTopic[k];
        const pct = Math.round((t.ok / t.total) * 100);
        return { k, pct, ok: t.ok, total: t.total, gap: pct < 80 };
      })
      .sort((a, b) => a.pct - b.pct);
    const p = score / questions.length;
    let faixa =
      "Faixa fundamento: volte ao caderno e ao glossário. Sem o modelo, o resto é memorização.";
    if (p >= 0.9) faixa = "Faixa Lead: o modelo está no sangue. Polir o tema mais fraco e ensinar o time.";
    else if (p >= 0.75)
      faixa = "Faixa pleno forte: você aguenta a mesa. Os gaps abaixo são o que um Lead vai cutucar.";
    else if (p >= 0.55)
      faixa = "Faixa pleno em construção: vocabulário existe, julgamento ainda fura.";

    const progress = loadProgress();
    progress.quiz = { ...progress.quiz, [trackKey]: score };
    saveProgress(progress);

    return (
      <>
        <div className="quiz-toolbar">
          <div className="quiz-meta">
            {questions.length} de {questions.length} respondidas
          </div>
        </div>
        <div className="progress" aria-hidden="true">
          <span style={{ width: "100%" }} />
        </div>
        <div className="quiz-result">
          <div className="callout">
            <strong>
              {score} de {questions.length}.
            </strong>{" "}
            {faixa}
          </div>
          <h3>Mapa de gaps por tema</h3>
          {rows.map((r) => (
            <div className="bar-row" key={r.k}>
              <div>{topics[r.k].name}</div>
              <div className={`bar${r.gap ? " gap" : ""}`}>
                <i style={{ width: `${r.pct}%` }} />
              </div>
              <div>
                {r.ok}/{r.total}
              </div>
            </div>
          ))}
          {rows.some((r) => r.gap) ? (
            <>
              <p>
                Estude nesta ordem (pior primeiro). O gabarito não aparece: volte ao
                texto e refaça o simulador.
              </p>
              <ul className="gap-list">
                {rows
                  .filter((r) => r.gap)
                  .map((r) => (
                    <li key={r.k}>
                      <Link href={topics[r.k].href}>{topics[r.k].name}</Link> — {r.ok}/
                      {r.total} ({r.pct}%). Abaixo de 80% é o que a entrevista vai
                      expor.
                    </li>
                  ))}
              </ul>
            </>
          ) : (
            <p className="ok">
              Nenhum tema ficou abaixo de 80%. Desenhe o modelo de memória e explique
              um PR ruim para um júnior.
            </p>
          )}
        </div>
        <div className="quiz-actions">
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              localStorage.removeItem(storeKey);
              persist(empty());
            }}
          >
            Recomeçar
          </button>
        </div>
      </>
    );
  }

  const item = questions[state.i];
  const topic = topics[item.t];
  const chosen = state.a[state.i];

  return (
    <>
      <div className="quiz-toolbar">
        <div className="quiz-meta">
          Pergunta {state.i + 1} de {questions.length}
        </div>
        <div className="quiz-meta">O progresso fica neste navegador até você recomeçar.</div>
      </div>
      <div className="progress" aria-hidden="true">
        <span style={{ width: `${bar}%` }} />
      </div>
      <article className="qcard">
        <div className="qnum">
          Pergunta {state.i + 1} · {topic.name}
        </div>
        <h3>{item.q}</h3>
        <div className="opts">
          {item.o.map((text, j) => (
            <label key={j} className={chosen === j ? "picked" : undefined}>
              <input
                type="radio"
                name="qnow"
                value={j}
                checked={chosen === j}
                onChange={() => {
                  persist({
                    a: { ...state.a, [state.i]: j },
                    i: state.i + 1,
                  });
                }}
              />{" "}
              {text}
            </label>
          ))}
        </div>
      </article>
      <div className="quiz-actions">
        {state.i > 0 ? (
          <button
            type="button"
            className="btn ghost"
            onClick={() => persist({ ...state, i: state.i - 1 })}
          >
            Pergunta anterior
          </button>
        ) : null}
        <button
          type="button"
          className="btn ghost"
          onClick={() => {
            localStorage.removeItem(storeKey);
            persist(empty());
          }}
        >
          Recomeçar
        </button>
      </div>
    </>
  );
}
