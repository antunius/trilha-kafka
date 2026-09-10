import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const webKafka = path.join(root, "web/content/kafka");
const webArq = path.join(root, "web/content/arquitetura");

function read(dir, file) {
  return fs.readFileSync(path.join(dir, file), "utf8");
}

function stripTail(html) {
  return html
    .replace(/\s*<\/div>\s*<\/body>\s*<\/html>\s*$/i, "")
    .trim();
}

function rewrite(html) {
  return html
    .replaceAll("/kafka/fundamentos#caderno", "/kafka/modelo-mental")
    .replaceAll("/kafka/fundamentos#ideia", "/kafka/modelo-mental")
    .replaceAll("/kafka/fundamentos#glossario", "/kafka/evento")
    .replaceAll("/kafka/fundamentos#evento", "/kafka/evento")
    .replaceAll("/kafka/fundamentos#topico", "/kafka/topico")
    .replaceAll("/kafka/fundamentos#particao", "/kafka/particao")
    .replaceAll("/kafka/fundamentos#offset", "/kafka/offset")
    .replaceAll("/kafka/fundamentos#key", "/kafka/key")
    .replaceAll("/kafka/fundamentos#broker", "/kafka/broker")
    .replaceAll("/kafka/fundamentos#isr", "/kafka/isr")
    .replaceAll("/kafka/fundamentos#produtor", "/kafka/produtor")
    .replaceAll("/kafka/fundamentos#consumidor", "/kafka/consumidor")
    .replaceAll("/kafka/fundamentos#rebalance", "/kafka/rebalance")
    .replaceAll("/kafka/fundamentos#retencao", "/kafka/retencao")
    .replaceAll("/kafka/fundamentos#schema", "/kafka/schema")
    .replaceAll("/kafka/fundamentos", "/kafka/modelo-mental")
    .replaceAll("/kafka/semana-1", "/kafka/particao")
    .replaceAll("/kafka/semana-2", "/kafka/garantias")
    .replaceAll("/kafka/semana-3", "/kafka/operacao")
    .replaceAll("/kafka/semana-4", "/kafka/outbox")
    .replaceAll("/kafka/semana-5", "/kafka/spring")
    .replaceAll("/kafka/semana-6", "/kafka/sintese")
    .replaceAll("/kafka/referencia", "/kafka/tech-lead")
    .replaceAll("/arquitetura/fundamentos#ideia", "/arquitetura/mapa")
    .replaceAll("/arquitetura/fundamentos#latencia", "/arquitetura/latencia")
    .replaceAll("/arquitetura/fundamentos#repl", "/arquitetura/replicacao")
    .replaceAll("/arquitetura/fundamentos#sync", "/arquitetura/sincrono")
    .replaceAll("/arquitetura/fundamentos", "/arquitetura/mapa")
    .replaceAll("/arquitetura/semana-1", "/arquitetura/escala")
    .replaceAll("/arquitetura/semana-2", "/arquitetura/resiliencia")
    .replaceAll("/arquitetura/semana-3", "/arquitetura/decomposicao")
    .replaceAll("/arquitetura/semana-4", "/arquitetura/dados")
    .replaceAll("/arquitetura/semana-5", "/arquitetura/observabilidade")
    .replaceAll('href="../kafka/"', 'href="/kafka"')
    .replaceAll("trilha-kafka.html", "/kafka");
}

function detemporize(html) {
  return html
    .replace(/<h2>Semana \d+\s+[—–-]\s+/g, "<h2>")
    .replace(/<h2>Semanas 6–8 — /g, "<h2>")
    .replace(/Esta semana /g, "Esta aula ")
    .replace(/esta semana /g, "esta aula ")
    .replace(/da semana /g, "desta aula ")
    .replace(/nesta semana/g, "nesta aula")
    .replace(/No fim da semana /g, "No fim desta aula ")
    .replace(/fim da semana/g, "fim desta aula")
    .replace(/Critério de pronto da semana \d+/g, "Critério de pronto")
    .replace(/Como estudar esta semana/g, "Como estudar este tema")
    .replace(/as seis semanas/g, "os temas")
    .replace(/As oito semanas/g, "Os temas anteriores")
    .replace(/oito semanas/g, "temas anteriores")
    .replace(/Um sistema por semana/g, "Um sistema por vez")
    .replace(/semana de fechar/gi, "aula de fechar")
    .replace(/volte só naquela semana/g, "volte só naquele tema")
    .replace(/a semana 1 não está pronta/g, "a aula de partição não está pronta")
    .replace(/a semana 3 não fechou/g, "a aula de operação não fechou")
    .replace(/inbox da semana 2/g, "inbox na aula de garantias")
    .replace(/inbox na semana 2/g, "inbox na aula de garantias")
    .replace(/consumidor, semana 2/g, "consumidor, aula de garantias")
    .replace(/isso é semana 2/g, "isso é a aula de garantias")
    .replace(/semana Spring/g, "aula Spring")
    .replace(/labs da semana 5/g, "labs da aula Spring")
    .replace(/Básico na semana 1/g, "Básico na aula de escala")
    .replace(/SQL vs NoSQL na semana 1/g, "SQL vs NoSQL na aula de escala")
    .replace(/Sharding na semana 1/g, "Sharding na aula de escala")
    .replace(/<a href="\/arquitetura\/system-design#s6">semanas 6–8<\/a>/g, '<a href="/arquitetura/system-design#s6">system design</a>')
    .replace(/Gateway\/BFF na <a href="\/arquitetura\/resiliencia#s2">semana 2<\/a>/g, 'Gateway/BFF na <a href="/arquitetura/resiliencia">aula de resiliência</a>')
    .replace(/<a href="\/arquitetura\/decomposicao#s3">Semana 3<\/a>/g, '<a href="/arquitetura/decomposicao">Decomposição</a>')
    .replace(/<a href="\/arquitetura\/resiliencia#s2">Semana 2<\/a>/g, '<a href="/arquitetura/resiliencia">Resiliência</a>')
    .replace(/CQRS: <a href="\/arquitetura\/dados#s4">semana 4<\/a>/g, 'CQRS: <a href="/arquitetura/dados">dados distribuídos</a>')
    .replace(/Outbox\/CDC na <a href="\/arquitetura\/dados#s4">semana 4<\/a>/g, 'Outbox/CDC na <a href="/arquitetura/dados">aula de dados</a>');
}

function extractBetween(html, startRe, endRe) {
  const start = html.search(startRe);
  if (start === -1) throw new Error(`start not found: ${startRe}`);
  const rest = html.slice(start);
  const endMatch = rest.slice(1).search(endRe);
  if (endMatch === -1) return rest;
  return rest.slice(0, endMatch + 1);
}

function extractArticle(html, id) {
  const re = new RegExp(
    `<article class="term" id="${id}">[\\s\\S]*?<\\/article>`,
  );
  const m = html.match(re);
  if (!m) throw new Error(`article ${id} not found`);
  return m[0];
}

function write(dir, slug, body) {
  fs.writeFileSync(path.join(dir, `${slug}.html`), rewrite(detemporize(body)).trim() + "\n");
}

const kafkaFund = stripTail(read(webKafka, "fundamentos.html"));
const arqFund = stripTail(read(webArq, "fundamentos.html"));

const kafkaModelo = extractBetween(
  kafkaFund,
  /<section id="ideia">/,
  /<section id="glossario">/,
);
write(webKafka, "modelo-mental", kafkaModelo);

for (const id of [
  "evento",
  "topico",
  "offset",
  "key",
  "broker",
  "isr",
  "produtor",
  "consumidor",
  "rebalance",
  "retencao",
]) {
  write(
    webKafka,
    id,
    `<section class="week">\n${extractArticle(kafkaFund, id)}\n</section>`,
  );
}

const particaoArt = extractArticle(kafkaFund, "particao");
const semana1 = stripTail(read(webKafka, "semana-1.html"));
write(webKafka, "particao", `${particaoArt}\n${semana1}`);

write(webKafka, "garantias", stripTail(read(webKafka, "semana-2.html")));
write(webKafka, "operacao", stripTail(read(webKafka, "semana-3.html")));
write(webKafka, "schema", `<section class="week">\n${extractArticle(kafkaFund, "schema")}\n</section>\n`);
write(webKafka, "outbox", stripTail(read(webKafka, "semana-4.html")));
write(webKafka, "spring", stripTail(read(webKafka, "semana-5.html")));
write(webKafka, "sintese", stripTail(read(webKafka, "semana-6.html")));
write(webKafka, "tech-lead", stripTail(read(webKafka, "referencia.html")));

const arqMapa = extractBetween(
  arqFund,
  /<section id="ideia">/,
  /<section id="glossario">/,
);
write(webArq, "mapa", arqMapa);

const arqIds = {
  sistema: "sistema",
  latencia: "latencia",
  disponibilidade: "disponibilidade",
  cap: "cap",
  acid: "acid",
  monolito: "monolito",
  sincrono: "sync",
  cache: "cache",
  replicacao: "repl",
  indice: "indice",
};

for (const [slug, id] of Object.entries(arqIds)) {
  write(
    webArq,
    slug,
    `<section class="week">\n${extractArticle(arqFund, id)}\n</section>`,
  );
}

write(
  webArq,
  "escala",
  stripTail(read(webArq, "semana-1.html")),
);
write(
  webArq,
  "resiliencia",
  `${extractArticle(arqFund, "resiliencia")}\n${stripTail(read(webArq, "semana-2.html"))}`,
);
write(webArq, "decomposicao", stripTail(read(webArq, "semana-3.html")));
write(
  webArq,
  "dados",
  `${extractArticle(arqFund, "padroes")}\n${stripTail(read(webArq, "semana-4.html"))}`,
);
write(
  webArq,
  "observabilidade",
  `${extractArticle(arqFund, "observabilidade")}\n${stripTail(read(webArq, "semana-5.html"))}`,
);

for (const extra of ["system-design", "staff", "catalogo", "referencia"]) {
  write(webArq, extra, stripTail(read(webArq, `${extra}.html`)));
}

for (const file of [
  "fundamentos.html",
  "semana-1.html",
  "semana-2.html",
  "semana-3.html",
  "semana-4.html",
  "semana-5.html",
  "semana-6.html",
  "referencia.html",
]) {
  const p = path.join(webKafka, file);
  if (fs.existsSync(p) && file !== "referencia.html") fs.unlinkSync(p);
}
fs.unlinkSync(path.join(webKafka, "referencia.html"));

for (const file of [
  "fundamentos.html",
  "semana-1.html",
  "semana-2.html",
  "semana-3.html",
  "semana-4.html",
  "semana-5.html",
]) {
  fs.unlinkSync(path.join(webArq, file));
}

console.log("split web/content lessons");
