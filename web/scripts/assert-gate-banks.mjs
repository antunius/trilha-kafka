import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const data = path.resolve(here, "../data/gates");

const kafka = [
  "modelo-mental", "evento", "topico", "particao", "offset", "key", "broker",
  "isr", "produtor", "consumidor", "rebalance", "retencao", "garantias",
  "operacao", "schema", "outbox", "spring", "sintese", "tech-lead",
];
const arq = [
  "mapa", "sistema", "latencia", "disponibilidade", "cap", "acid", "monolito",
  "sincrono", "cache", "replicacao", "indice", "escala", "resiliencia",
  "decomposicao", "dados", "observabilidade", "system-design", "staff",
  "catalogo", "referencia",
];

let failed = 0;
for (const [track, slugs] of [["kafka", kafka], ["arquitetura", arq]]) {
  for (const slug of slugs) {
    const file = path.join(data, track, `${slug}.json`);
    if (!fs.existsSync(file)) {
      console.error("missing", file);
      failed++;
      continue;
    }
    const { questions } = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!Array.isArray(questions) || questions.length < 100) {
      console.error("short bank", track, slug, questions?.length);
      failed++;
    }
    for (const q of questions) {
      if (!q.q || !Array.isArray(q.o) || q.o.length !== 4 || typeof q.a !== "number" || !q.w) {
        console.error("bad question", track, slug);
        failed++;
        break;
      }
    }
  }
}

if (failed) {
  process.exit(1);
}
console.log("all gate banks ≥100");
