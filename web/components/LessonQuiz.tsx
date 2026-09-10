"use client";

import { useEffect, useState } from "react";
import { shuffleQuestions, type GateQuestion } from "@/lib/gates";
import { loadProgress, markGatePassed, passedPaths } from "@/lib/progress";

const NEED = 5;
const PASS_AT = 4;

export function LessonQuiz({
  path,
  questions,
  onPassed,
}: {
  path: string;
  questions: GateQuestion[];
  onPassed: () => void;
}) {
  const [hydrated, setHydrated] = useState(false);
  const [already, setAlready] = useState(false);
  const [round, setRound] = useState<GateQuestion[]>([]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  function startRound() {
    setRound(shuffleQuestions(questions, NEED));
    setI(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  }

  useEffect(() => {
    const passed = passedPaths(loadProgress()).has(path);
    setAlready(passed);
    if (!passed) startRound();
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, questions]);

  if (!hydrated) {
    return <p className="quiz-meta">Carregando o simulador…</p>;
  }

  if (already) {
    return (
      <section className="lesson-quiz" id="simulador-aula">
        <h2>Simulador desta aula</h2>
        <div className="ok">
          Você já passou (pelo menos {PASS_AT} de {NEED}). A próxima aula está
          destrancada neste navegador.
        </div>
      </section>
    );
  }

  if (!round.length) {
    return (
      <section className="lesson-quiz" id="simulador-aula">
        <h2>Simulador desta aula</h2>
        <p className="quiz-meta">Banco desta aula ainda não carregou.</p>
      </section>
    );
  }

  if (done) {
    const ok = score >= PASS_AT;
    return (
      <section className="lesson-quiz" id="simulador-aula">
        <h2>Simulador desta aula</h2>
        <div className={ok ? "ok" : "warn"}>
          <strong>
            {score} de {NEED}.
          </strong>{" "}
          {ok
            ? "A próxima aula destrancou."
            : `Precisa de ${PASS_AT} acertos (80%). Sorteamos outras 5.`}
        </div>
        <div className="quiz-actions">
          {ok ? null : (
            <button type="button" className="btn" onClick={startRound}>
              Tentar de novo
            </button>
          )}
        </div>
      </section>
    );
  }

  const item = round[i];
  const revealed = picked !== null;

  return (
    <section className="lesson-quiz" id="simulador-aula">
      <h2>Simulador desta aula</h2>
      <p className="quiz-meta">
        5 perguntas sorteadas do banco. {PASS_AT} acertos destrancam a próxima.
        Pergunta {i + 1} de {NEED}.
      </p>
      <div className="progress" aria-hidden="true">
        <span style={{ width: `${Math.round((i / NEED) * 100)}%` }} />
      </div>
      <article className="qcard">
        <div className="qnum">
          Pergunta {i + 1} · {score} certo{score === 1 ? "" : "s"} até agora
        </div>
        <h3>{item.q}</h3>
        <div className="opts">
          {item.o.map((text, j) => {
            let cls = picked === j ? "picked" : undefined;
            if (revealed) {
              if (j === item.a) cls = "correct";
              else if (j === picked && j !== item.a) cls = "wrong";
            }
            return (
              <label key={j} className={cls}>
                <input
                  type="radio"
                  name="lesson-q"
                  value={j}
                  disabled={revealed}
                  checked={picked === j}
                  onChange={() => setPicked(j)}
                />{" "}
                {text}
              </label>
            );
          })}
        </div>
        {revealed ? <p className="quiz-why">{item.w}</p> : null}
      </article>
      <div className="quiz-actions">
        {revealed ? (
          <button
            type="button"
            className="btn"
            onClick={() => {
              const add = picked === item.a ? 1 : 0;
              const nextScore = score + add;
              if (i + 1 >= NEED) {
                setScore(nextScore);
                setDone(true);
                if (nextScore >= PASS_AT) {
                  markGatePassed(path);
                  onPassed();
                }
              } else {
                setScore(nextScore);
                setI(i + 1);
                setPicked(null);
              }
            }}
          >
            {i + 1 >= NEED ? "Ver resultado" : "Próxima"}
          </button>
        ) : null}
      </div>
    </section>
  );
}
