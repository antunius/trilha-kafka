import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const web = path.join(root, "web/content");

const kafkaNav = [
  ["index.html", "Início"],
  ["modelo-mental.html", "Modelo mental"],
  ["evento.html", "Evento"],
  ["topico.html", "Tópico"],
  ["particao.html", "Partição"],
  ["offset.html", "Offset"],
  ["key.html", "Key"],
  ["broker.html", "Broker"],
  ["isr.html", "ISR"],
  ["produtor.html", "Produtor"],
  ["consumidor.html", "Consumidor"],
  ["rebalance.html", "Rebalance"],
  ["retencao.html", "Retenção"],
  ["garantias.html", "Garantias"],
  ["operacao.html", "Operação"],
  ["schema.html", "Schema Registry"],
  ["outbox.html", "Outbox"],
  ["spring.html", "Spring Kafka"],
  ["sintese.html", "Síntese"],
  ["tech-lead.html", "Tech Lead"],
  ["simulador.html", "Simulador"],
];

const arqNav = [
  ["index.html", "Início"],
  ["mapa.html", "Mapa"],
  ["sistema.html", "Sistema"],
  ["latencia.html", "Latência"],
  ["disponibilidade.html", "Disponibilidade"],
  ["cap.html", "CAP"],
  ["acid.html", "ACID"],
  ["monolito.html", "Monolito"],
  ["sincrono.html", "Síncrono"],
  ["cache.html", "Cache"],
  ["replicacao.html", "Replicação"],
  ["indice.html", "Índice"],
  ["escala.html", "Escala"],
  ["resiliencia.html", "Resiliência"],
  ["decomposicao.html", "Decomposição"],
  ["dados.html", "Dados"],
  ["observabilidade.html", "Observabilidade"],
  ["system-design.html", "System design"],
  ["staff.html", "Nível Staff"],
  ["catalogo.html", "Catálogo"],
  ["referencia.html", "Arquiteto"],
  ["simulador.html", "Simulador"],
];

function toc(nav) {
  return `<nav class="toc" aria-label="Índice">${nav
    .map(([href, label]) => `<a href="${href}">${label}</a>`)
    .join("\n      ")}</nav>`;
}

function wrap(track, title, lede, eyebrow, body, nav) {
  const prefix = track === "kafka" ? "Kafka" : "Arquitetura";
  const home = "index.html";
  const staticBody = body
    .replaceAll('src="/diagrams/', 'src="../diagrams/')
    .replace(/href="\/kafka\/([^"#]+)(#[^"]*)?"/g, 'href="$1.html$2"')
    .replace(/href="\/arquitetura\/([^"#]+)(#[^"]*)?"/g, 'href="$1.html$2"');
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} — ${prefix}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,650&family=Source+Sans+3:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../trilhas.css" />
</head>
<body>
  <div class="wrap">
    <header class="hero">
      <p class="crumb"><a href="../index.html">Trilhas</a> · <a href="${home}">${prefix}</a></p>
      <div class="eyebrow">${eyebrow}</div>
      <h1>${title}</h1>
      <p class="lede">${lede}</p>
    </header>
    ${toc(nav)}
    ${staticBody}
    <footer>Trilha ${prefix} por tema.</footer>
  </div>
</body>
</html>
`;
}

function redirectPage(to, label) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="refresh" content="0;url=${to}" />
  <link rel="canonical" href="${to}" />
  <title>Movido</title>
</head>
<body>
  <p>Esta aula foi para <a href="${to}">${label}</a>.</p>
</body>
</html>
`;
}

function copyLessons(track, nav, eyebrow) {
  const dest = path.join(root, track);
  const src = path.join(web, track);
  for (const [file] of nav) {
    if (file === "index.html" || file === "simulador.html") continue;
    const slug = file.replace(/\.html$/, "");
    const body = fs.readFileSync(path.join(src, `${slug}.html`), "utf8");
    const title = slug;
    fs.writeFileSync(
      path.join(dest, file),
      wrap(track, title, "", eyebrow, body, nav),
    );
  }
}

copyLessons("kafka", kafkaNav, "Trilha 4 · Kafka");
copyLessons("arquitetura", arqNav, "Trilha 7 · Arquitetura");

const kafkaRedirects = {
  "fundamentos.html": ["modelo-mental.html", "Modelo mental"],
  "semana-1.html": ["particao.html", "Partição"],
  "semana-2.html": ["garantias.html", "Garantias"],
  "semana-3.html": ["operacao.html", "Operação"],
  "semana-4.html": ["outbox.html", "Outbox"],
  "semana-5.html": ["spring.html", "Spring Kafka"],
  "semana-6.html": ["sintese.html", "Síntese"],
  "referencia.html": ["tech-lead.html", "Tech Lead"],
};
const arqRedirects = {
  "fundamentos.html": ["mapa.html", "Mapa"],
  "semana-1.html": ["escala.html", "Escala"],
  "semana-2.html": ["resiliencia.html", "Resiliência"],
  "semana-3.html": ["decomposicao.html", "Decomposição"],
  "semana-4.html": ["dados.html", "Dados"],
  "semana-5.html": ["observabilidade.html", "Observabilidade"],
};

for (const [file, [to, label]] of Object.entries(kafkaRedirects)) {
  fs.writeFileSync(path.join(root, "kafka", file), redirectPage(to, label));
}
for (const [file, [to, label]] of Object.entries(arqRedirects)) {
  fs.writeFileSync(path.join(root, "arquitetura", file), redirectPage(to, label));
}

console.log("synced static html");
