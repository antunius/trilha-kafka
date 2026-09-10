"use client";

import { useEffect, useState } from "react";
import { loadProgress, saveProgress } from "@/lib/progress";

export function SessionChecklist({ path }: { path: string }) {
  const [checks, setChecks] = useState([false, false, false]);

  useEffect(() => {
    const p = loadProgress();
    setChecks(p.sessions?.[path] ?? [false, false, false]);
  }, [path]);

  function toggle(i: number) {
    const next = checks.map((v, j) => (j === i ? !v : v));
    setChecks(next);
    const p = loadProgress();
    p.sessions = { ...p.sessions, [path]: next };
    saveProgress(p);
  }

  return (
    <article className="term">
      <div className="tag">Progresso desta página</div>
      <h3>Marque as sessões de 45 min</h3>
      {["Sessão 1", "Sessão 2", "Sessão 3"].map((label, i) => (
        <label key={label} style={{ display: "block", margin: "8px 0" }}>
          <input
            type="checkbox"
            checked={checks[i]}
            onChange={() => toggle(i)}
          />{" "}
          {label} feita
        </label>
      ))}
    </article>
  );
}
