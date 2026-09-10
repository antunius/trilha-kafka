"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { NavItem } from "@/lib/catalog";
import {
  firstPendingPath,
  isLessonUnlocked,
  loadProgress,
  passedPaths,
} from "@/lib/progress";

export function GateWall({
  path,
  nav,
  children,
}: {
  path: string;
  nav: NavItem[];
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [pending, setPending] = useState<string | undefined>();

  useEffect(() => {
    const set = passedPaths(loadProgress());
    setUnlocked(isLessonUnlocked(nav, path, set));
    setPending(firstPendingPath(nav, set));
    setReady(true);
  }, [nav, path]);

  if (!ready) return <p className="quiz-meta">Carregando…</p>;
  if (unlocked) return children;

  return (
    <div className="gate-wall">
      <div className="warn">
        <strong>Simulador de entrevista trancado.</strong> Passe o simulador de
        cada aula (4 de 5) até o fim da trilha.
      </div>
      {pending ? (
        <p>
          Primeira aula pendente: <Link href={pending}>{pending}</Link>
        </p>
      ) : null}
    </div>
  );
}
