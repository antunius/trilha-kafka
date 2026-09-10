"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Pager } from "@/components/Pager";
import { HtmlBody } from "@/components/HtmlBody";
import { CadernoKafka } from "@/components/CadernoKafka";
import { OutboxWalkthrough } from "@/components/OutboxWalkthrough";
import { LessonQuiz } from "@/components/LessonQuiz";
import type { LessonMeta, NavItem } from "@/lib/catalog";
import { neighbors } from "@/lib/catalog";
import type { GateQuestion } from "@/lib/gates";
import {
  firstPendingPath,
  isLessonUnlocked,
  loadProgress,
  passedPaths,
} from "@/lib/progress";

export function LessonView({
  lesson,
  nav,
  html,
  questions,
}: {
  lesson: LessonMeta;
  nav: NavItem[];
  html: string;
  questions: GateQuestion[];
}) {
  const { prev, next } = neighbors(nav, lesson.path);
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [passed, setPassed] = useState(false);
  const [pending, setPending] = useState<string | undefined>();

  function refresh() {
    const state = loadProgress();
    const set = passedPaths(state);
    setUnlocked(isLessonUnlocked(nav, lesson.path, set));
    setPassed(set.has(lesson.path));
    setPending(firstPendingPath(nav, set));
  }

  useEffect(() => {
    refresh();
    setReady(true);
  }, [lesson.path, nav]);

  const showCaderno = lesson.path === "/kafka/modelo-mental";
  const showOutbox = lesson.path === "/kafka/outbox";
  const nextLocked = Boolean(next) && !passed;

  if (!ready) {
    return <p className="quiz-meta">Carregando a aula…</p>;
  }

  if (!unlocked) {
    return (
      <div className="gate-wall">
        <div className="warn">
          <strong>Aula trancada.</strong> Passe o simulador da aula anterior (4 de
          5) para continuar.
        </div>
        {pending ? (
          <p>
            Primeira aula pendente:{" "}
            <Link href={pending}>{pending}</Link>
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <>
      {showCaderno ? <CadernoKafka /> : null}
      {showOutbox ? <OutboxWalkthrough /> : null}
      <div className="prose">
        <HtmlBody html={html} />
        <LessonQuiz
          path={lesson.path}
          questions={questions}
          onPassed={refresh}
        />
      </div>
      <Pager prev={prev} next={next} nextLocked={nextLocked} />
    </>
  );
}
