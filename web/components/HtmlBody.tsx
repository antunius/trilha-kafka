"use client";

import { useEffect, useRef, useState } from "react";

export function HtmlBody({
  html,
  searchable,
}: {
  html: string;
  searchable?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!searchable) return;
    const root = ref.current;
    if (!root) return;
    const needle = q.trim().toLowerCase();
    root.querySelectorAll("article.term").forEach((el) => {
      const text = el.textContent?.toLowerCase() ?? "";
      (el as HTMLElement).style.display =
        !needle || text.includes(needle) ? "" : "none";
    });
  }, [q, searchable, html]);

  return (
    <>
      {searchable ? (
        <div className="search-row">
          <label className="tag" htmlFor="gloss-q">
            Buscar no glossário
          </label>
          <input
            id="gloss-q"
            type="search"
            placeholder="offset, ISR, CAP, saga…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      ) : null}
      <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
