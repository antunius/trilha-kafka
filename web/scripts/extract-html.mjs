import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "../..");
const outContent = path.resolve(import.meta.dirname, "../content");
const outData = path.resolve(import.meta.dirname, "../data");

const kafkaMap = {
  "index.html": "/kafka",
  "modelo-mental.html": "/kafka/modelo-mental",
  "evento.html": "/kafka/evento",
  "topico.html": "/kafka/topico",
  "particao.html": "/kafka/particao",
  "offset.html": "/kafka/offset",
  "key.html": "/kafka/key",
  "broker.html": "/kafka/broker",
  "isr.html": "/kafka/isr",
  "produtor.html": "/kafka/produtor",
  "consumidor.html": "/kafka/consumidor",
  "rebalance.html": "/kafka/rebalance",
  "retencao.html": "/kafka/retencao",
  "garantias.html": "/kafka/garantias",
  "operacao.html": "/kafka/operacao",
  "schema.html": "/kafka/schema",
  "outbox.html": "/kafka/outbox",
  "spring.html": "/kafka/spring",
  "sintese.html": "/kafka/sintese",
  "tech-lead.html": "/kafka/tech-lead",
  "simulador.html": "/kafka/simulador",
};

const arqMap = {
  "index.html": "/arquitetura",
  "mapa.html": "/arquitetura/mapa",
  "sistema.html": "/arquitetura/sistema",
  "latencia.html": "/arquitetura/latencia",
  "disponibilidade.html": "/arquitetura/disponibilidade",
  "cap.html": "/arquitetura/cap",
  "acid.html": "/arquitetura/acid",
  "monolito.html": "/arquitetura/monolito",
  "sincrono.html": "/arquitetura/sincrono",
  "cache.html": "/arquitetura/cache",
  "replicacao.html": "/arquitetura/replicacao",
  "indice.html": "/arquitetura/indice",
  "escala.html": "/arquitetura/escala",
  "resiliencia.html": "/arquitetura/resiliencia",
  "decomposicao.html": "/arquitetura/decomposicao",
  "dados.html": "/arquitetura/dados",
  "observabilidade.html": "/arquitetura/observabilidade",
  "system-design.html": "/arquitetura/system-design",
  "staff.html": "/arquitetura/staff",
  "catalogo.html": "/arquitetura/catalogo",
  "referencia.html": "/arquitetura/referencia",
  "simulador.html": "/arquitetura/simulador",
};

const skipExtract = new Set([
  "index.html",
  "simulador.html",
  "fundamentos.html",
  "semana-1.html",
  "semana-2.html",
  "semana-3.html",
  "semana-4.html",
  "semana-5.html",
  "semana-6.html",
]);

function rewrite(html, folder) {
  const map = folder === "kafka" ? kafkaMap : arqMap;
  return html
    .replace(/href="\.\.\/index\.html"/g, 'href="/"')
    .replace(/src="\.\.\/diagrams\//g, 'src="/diagrams/')
    .replace(/href="([^"]+\.html)(#[^"]*)?"/g, (_, file, hash = "") => {
      const dest = map[file];
      if (!dest) return `href="${file}${hash}"`;
      return `href="${dest}${hash}"`;
    });
}

function extractMain(html) {
  const wrapIdx = html.indexOf('<div class="wrap">');
  let body = html.slice(wrapIdx + '<div class="wrap">'.length);
  const scriptIdx = body.indexOf("<script>");
  if (scriptIdx !== -1) body = body.slice(0, scriptIdx);
  body = body.replace(/<\/div>\s*$/, "");
  body = body.replace(/<header class="hero">[\s\S]*?<\/header>/, "");
  body = body.replace(/<nav class="toc"[^>]*>[\s\S]*?<\/nav>/, "");
  body = body.replace(/<nav class="pager">[\s\S]*?<\/nav>/, "");
  body = body.replace(/<footer>[\s\S]*?<\/footer>/, "");
  return body.trim();
}

function extractQuestions(html) {
  const start = html.indexOf("const TOPICS = ");
  const store = html.indexOf("const STORE");
  if (start === -1 || store === -1) return null;
  const code = html.slice(start, store) + "\n({ TOPICS, QUESTIONS })";
  return vm.runInNewContext(code);
}

function processFolder(folder) {
  const dir = path.join(root, folder);
  const dest = path.join(outContent, folder);
  fs.mkdirSync(dest, { recursive: true });
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".html"))) {
    if (skipExtract.has(file)) continue;
    if (folder === "kafka" && file === "referencia.html") continue;
    if (!(file in (folder === "kafka" ? kafkaMap : arqMap))) continue;
    const html = fs.readFileSync(path.join(dir, file), "utf8");
    const main = rewrite(extractMain(html), folder);
    const slug = file.replace(/\.html$/, "");
    fs.writeFileSync(path.join(dest, `${slug}.html`), main);
  }
}

fs.mkdirSync(outData, { recursive: true });
processFolder("kafka");
processFolder("arquitetura");

for (const [folder, file] of [
  ["kafka", "kafka/simulador.html"],
  ["arquitetura", "arquitetura/simulador.html"],
]) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const data = extractQuestions(html);
  if (!data?.TOPICS || !data?.QUESTIONS) {
    console.warn(`skip quiz extract for ${file}`);
    continue;
  }
  const topics = {};
  for (const [k, v] of Object.entries(data.TOPICS)) {
    const href = String(v.href)
      .replace(/fundamentos\.html/g, `/${folder}/fundamentos`)
      .replace(/semana-(\d)\.html/g, `/${folder}/semana-$1`)
      .replace(/referencia\.html/g, `/${folder}/referencia`)
      .replace(/staff\.html/g, "/arquitetura/staff")
      .replace(/catalogo\.html/g, "/arquitetura/catalogo")
      .replace(/system-design\.html/g, "/arquitetura/system-design");
    topics[k] = { name: v.name, href };
  }
  fs.writeFileSync(
    path.join(outData, `${folder}-quiz.json`),
    JSON.stringify({ topics, questions: data.QUESTIONS }, null, 2),
  );
}

console.log("extracted content + quiz json");
