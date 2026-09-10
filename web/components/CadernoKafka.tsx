"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { id: number; key: string; text: string };

const WRITES = [
  { key: "12", partition: 0, text: "PedidoCriado 12" },
  { key: "99", partition: 1, text: "PedidoCriado 99" },
  { key: "7", partition: 2, text: "PedidoCriado 7" },
] as const;

const SEED: Msg[][] = [
  [{ id: 1, key: "45", text: "PedidoCriado 45" }],
  [
    { id: 2, key: "71", text: "PedidoCriado 71" },
    { id: 3, key: "88", text: "PedidoCriado 88" },
  ],
  [{ id: 4, key: "8", text: "PedidoCriado 8" }],
];

function markUntil(n: number) {
  return n === 0 ? "o começo" : `offset ${n - 1}`;
}

export function CadernoKafka() {
  const [logs, setLogs] = useState<Msg[][]>(SEED);
  const [focus, setFocus] = useState(1);
  const [fat, setFat] = useState([0, 0, 0]);
  const [ana, setAna] = useState([0, 0, 0]);
  const [flying, setFlying] = useState<{
    key: string;
    partition: number;
    text: string;
    id: number;
  } | null>(null);
  const [last, setLast] = useState<{ key: string; partition: number } | null>(null);
  const [seq, setSeq] = useState(10);
  const inflight = useRef<number | null>(null);

  function reduceMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function commit(key: string, partition: number, text: string, id: number) {
    if (inflight.current !== id) return;
    inflight.current = null;
    setLogs((prev) => {
      const next = prev.map((col) => [...col]);
      next[partition] = [...next[partition], { id, key, text }];
      return next;
    });
    setLast({ key, partition });
    setFocus(partition);
    setFlying(null);
  }

  function write(w: (typeof WRITES)[number]) {
    if (inflight.current !== null) return;
    if (logs[w.partition].length >= 6) return;
    const id = seq + 1;
    setSeq(id);
    inflight.current = id;
    if (reduceMotion()) {
      commit(w.key, w.partition, w.text, id);
      return;
    }
    setFlying({ ...w, id });
  }

  useEffect(() => {
    if (!flying) return;
    const t = window.setTimeout(() => {
      commit(flying.key, flying.partition, flying.text, flying.id);
    }, 650);
    return () => window.clearTimeout(t);
  }, [flying]);

  function advance(which: "fat" | "ana") {
    const cur = which === "fat" ? fat : ana;
    const set = which === "fat" ? setFat : setAna;
    const max = logs[focus].length;
    const next = [...cur];
    next[focus] = Math.min(max, next[focus] + 1);
    set(next);
  }

  let live =
    "Escreva um recado. A key escolhe a coluna. Cada time tem a própria marca “já li até aqui”.";
  if (flying) {
    live = `PedidoCriado ${flying.key} voa para a P${flying.partition} — hash(${flying.key}) % 3.`;
  } else if (last) {
    const unreadFat = fat[last.partition] < logs[last.partition].length;
    const unreadAna = ana[last.partition] < logs[last.partition].length;
    live = `O recado caiu na P${last.partition}. Faturamento ${
      unreadFat ? "ainda não leu" : "já passou"
    }; analytics ${unreadAna ? "ainda não leu" : "já passou"}.`;
  }

  return (
    <section className="cluster-scene" aria-label="Cluster Kafka interativo">
      <div className="tag">Interativo</div>
      <h3>O cluster em movimento</h3>
      <p className="analogy">
        O checkout escreve no caderno. A key escolhe a coluna. Faturamento e analytics
        leem o mesmo caderno com marcas diferentes.
      </p>
      <div className="caderno-actions">
        {WRITES.map((w) => (
          <button
            type="button"
            className="btn ghost"
            key={w.key}
            disabled={Boolean(flying) || logs[w.partition].length >= 6}
            onClick={() => write(w)}
          >
            Escrever key {w.key}
          </button>
        ))}
        <button type="button" className="btn" onClick={() => advance("fat")}>
          Faturamento lê P{focus}
        </button>
        <button type="button" className="btn ghost" onClick={() => advance("ana")}>
          Analytics lê P{focus}
        </button>
      </div>
      <p className="cluster-live" aria-live="polite">
        {live}
      </p>
      <div className="cluster-board">
        <div className="cluster-producer">
          <span className="kicker">Produtor</span>
          <strong>Checkout</strong>
          <span className="cluster-producer-hint">escreve no tópico pedidos</span>
        </div>
        {flying ? (
          <div
            className={`cluster-packet p${flying.partition}`}
            onAnimationEnd={() =>
              commit(flying.key, flying.partition, flying.text, flying.id)
            }
          >
            {flying.text}
          </div>
        ) : null}
        <div className="cluster-topic">
          <span className="kicker">Tópico pedidos · três colunas</span>
        </div>
        <div className="cluster-lanes">
          {logs.map((msgs, i) => (
            <button
              type="button"
              className={`cluster-lane${focus === i ? " on" : ""}`}
              key={i}
              onClick={() => setFocus(i)}
            >
              <strong className="col-title">P{i}</strong>
              <span className="cluster-lane-hint">
                {focus === i ? "coluna focada" : `hash % 3 = ${i}`}
              </span>
              <div className="cluster-log">
                {msgs.map((m, j) => (
                  <div className="cluster-line" key={m.id}>
                    <span className="cluster-off">offset {j}</span>
                    {m.text}
                  </div>
                ))}
              </div>
              <div
                className={`cluster-mark fat${fat[i] >= msgs.length ? " idle" : ""}`}
              >
                Faturamento · {markUntil(fat[i])}
              </div>
              <div
                className={`cluster-mark ana${ana[i] >= msgs.length ? " idle" : ""}`}
              >
                Analytics · {markUntil(ana[i])}
              </div>
            </button>
          ))}
        </div>
        <div className="cluster-groups">
          <div>
            <span className="kicker">Grupo faturamento</span>
            <strong>em cada coluna, uma marca “já li até aqui”</strong>
          </div>
          <div>
            <span className="kicker">Grupo analytics</span>
            <strong>outra marca, outro ritmo</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
