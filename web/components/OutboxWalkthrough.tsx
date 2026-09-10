"use client";

import { useState } from "react";

const STEPS = [
  {
    title: "A canetada no banco",
    body: "Na mesma transação: grava o pedido e um recado na tabela outbox. O Kafka ainda não viu nada.",
  },
  {
    title: "O carteiro",
    body: "Um poller (ou Debezium) lê recados com publicado_em nulo e manda para o tópico.",
  },
  {
    title: "Kafka fora",
    body: "O broker cai. O pedido continua no Postgres. O recado continua na caixinha. Nada se perde.",
  },
  {
    title: "O broker volta",
    body: "O carteiro tenta de novo. At-least-once na publicação — o consumidor precisa de inbox.",
  },
];

function on(active: boolean) {
  return active ? "on" : "off";
}

export function OutboxWalkthrough() {
  const [i, setI] = useState(0);
  const step = STEPS[i];
  const pg = true;
  const recadoInBox = i === 0 || i === 2 || i === 3;
  const kafkaUp = i === 1 || i === 3;
  const kafkaDown = i === 2;
  const inTopic = i === 1 || i === 3;
  const courier = i === 1 || i === 3;
  const consumer = i === 3;

  return (
    <section className="outbox-scene" aria-label="Outbox passo a passo">
      <div className="tag">Interativo</div>
      <h3>Outbox em quatro batidas</h3>
      <div className="outbox-stage">
        <div className="step">
          Passo {i + 1} de {STEPS.length}
        </div>
        <h4>{step.title}</h4>
        <p>{step.body}</p>
      </div>
      <div className="outbox-board">
        <div className={`outbox-box ${on(pg)}`}>
          <span className="kicker">Postgres</span>
          <strong>Pedido 99</strong>
          <span className={`outbox-chip ${on(recadoInBox)}`}>
            outbox · PedidoCriado
          </span>
        </div>
        <div className={`outbox-arrow ${on(courier)}`} aria-hidden="true">
          →
        </div>
        <div className={`outbox-box ${on(kafkaUp)} ${kafkaDown ? "down" : ""}`}>
          <span className="kicker">Kafka</span>
          <strong>{kafkaDown ? "Broker fora" : "tópico pedidos"}</strong>
          <span className={`outbox-chip ${on(inTopic)}`}>
            {inTopic ? "PedidoCriado 99" : "vazio"}
          </span>
        </div>
        <div className={`outbox-arrow ${on(consumer)}`} aria-hidden="true">
          →
        </div>
        <div className={`outbox-box ${on(consumer)}`}>
          <span className="kicker">Consumidor</span>
          <strong>Faturamento</strong>
          <span className={`outbox-chip ${on(consumer)}`}>
            {consumer ? "inbox · já vi o 99" : "ainda não leu"}
          </span>
        </div>
      </div>
      <div className="caderno-actions">
        <button
          type="button"
          className="btn ghost"
          disabled={i === 0}
          onClick={() => setI((n) => Math.max(0, n - 1))}
        >
          Anterior
        </button>
        <button
          type="button"
          className="btn"
          disabled={i === STEPS.length - 1}
          onClick={() => setI((n) => Math.min(STEPS.length - 1, n + 1))}
        >
          Próximo
        </button>
      </div>
    </section>
  );
}
