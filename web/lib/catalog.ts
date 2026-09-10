export type NavItem = { href: string; label: string };

export type LessonMeta = {
  slug: string;
  path: string;
  title: string;
  description: string;
  eyebrow: string;
  ogType: "website" | "article";
};

const kafkaEyebrow = "Trilha 4 · Kafka";
const arqEyebrow = "Trilha 7 · Arquitetura";

type LessonDef = {
  slug: string;
  nav: string;
  title: string;
  description: string;
};

function lessonsFrom(
  prefix: string,
  eyebrow: string,
  defs: LessonDef[],
): LessonMeta[] {
  return defs.map((d) => ({
    slug: d.slug,
    path: `${prefix}/${d.slug}`,
    title: d.title,
    description: d.description,
    eyebrow,
    ogType: "article" as const,
  }));
}

const kafkaDefs: LessonDef[] = [
  {
    slug: "modelo-mental",
    nav: "Modelo mental",
    title: "O caderno infinito",
    description:
      "Kafka não é fila. Fila vs log, o caderno compartilhado e por que a leitura não apaga a linha.",
  },
  {
    slug: "evento",
    nav: "Evento",
    title: "Evento",
    description:
      "Fato do passado, imutável. Key, value, offset e por que PedidoUpdated genérico não é contrato.",
  },
  {
    slug: "topico",
    nav: "Tópico",
    title: "Tópico",
    description:
      "Nome no cluster que aponta para logs. Contrato pelo fato (pedidos.criados), não pelo destinatário.",
  },
  {
    slug: "particao",
    nav: "Partição",
    title: "Partição",
    description:
      "Log independente, ordem local e o teto de consumidores. Criar, descrever e o que acontece ao aumentar N.",
  },
  {
    slug: "offset",
    nav: "Offset",
    title: "Offset",
    description:
      "Número da linha naquela coluna. Marca do grupo em __consumer_offsets, não na mensagem.",
  },
  {
    slug: "key",
    nav: "Key",
    title: "Key",
    description:
      "Quem escolhe a coluna. Mesma key, mesma partição — até você aumentar o número de partições.",
  },
  {
    slug: "broker",
    nav: "Broker",
    title: "Broker, cluster e controller",
    description:
      "Processo que guarda partições. Você fala com o líder, não com “o Kafka”. KRaft no lab.",
  },
  {
    slug: "isr",
    nav: "ISR",
    title: "Líder, réplica e ISR",
    description:
      "Quem está em dia com a ata. acks=all espera o ISR; não cobra o cartão por você.",
  },
  {
    slug: "produtor",
    nav: "Produtor",
    title: "Produtor",
    description:
      "Serializa, escolhe partição, espera ACK. “Mandei” no log da app não é ISR confirmado.",
  },
  {
    slug: "consumidor",
    nav: "Consumidor",
    title: "Consumidor e consumer group",
    description:
      "O crachá group.id. Mesmo grupo divide colunas; outro grupo lê o caderno de novo.",
  },
  {
    slug: "rebalance",
    nav: "Rebalance",
    title: "Rebalance",
    description:
      "O time para, redistribui colunas e só então volta. max.poll.interval e o loop de morte.",
  },
  {
    slug: "retencao",
    nav: "Retenção",
    title: "Segmento, retenção e compaction",
    description:
      "O caderno não é eterno. Segmentos velhos vão embora — ou fica a última linha de cada key.",
  },
  {
    slug: "garantias",
    nav: "Garantias",
    title: "Garantias de entrega",
    description:
      "At-least-once, idempotência e commit. acks=all não impede cobrança duplicada.",
  },
  {
    slug: "operacao",
    nav: "Operação",
    title: "Operação",
    description:
      "Lag, partição quente, DLT e o que de fato importa nas configs de produtor e consumidor.",
  },
  {
    slug: "schema",
    nav: "Schema Registry",
    title: "Schema Registry",
    description:
      "Cartório de contratos. BACKWARD, campo opcional vs rename, e a evolução que o Registry recusa.",
  },
  {
    slug: "outbox",
    nav: "Outbox",
    title: "Outbox e inbox",
    description:
      "Banco e broker não compartilham transação mágica. Caixinha na mesma canetada, carteiro depois.",
  },
  {
    slug: "spring",
    nav: "Spring Kafka",
    title: "Spring Kafka e laboratório",
    description:
      "KafkaTemplate, listener, concurrency e nove laboratórios para ver o modelo no log.",
  },
  {
    slug: "sintese",
    nav: "Síntese",
    title: "Síntese",
    description:
      "Ensaio de entrevista: glossário cego, o fluxo do pedido 99 e o simulador de 50 questões.",
  },
  {
    slug: "tech-lead",
    nav: "Tech Lead",
    title: "Virar a referência",
    description:
      "Contrato do tópico, operação e saber dizer não. O que muda no objetivo de Lead.",
  },
];

const arqDefs: LessonDef[] = [
  {
    slug: "mapa",
    nav: "Mapa",
    title: "Ideia e mapa",
    description:
      "Arquitetura é decisão cara de reverter. Vocabulário antes de desenhar caixas.",
  },
  {
    slug: "sistema",
    nav: "Sistema",
    title: "Sistema, componente e fronteira",
    description:
      "O todo, a peça deployável e o contrato. Serviço não é pasta no Git.",
  },
  {
    slug: "latencia",
    nav: "Latência",
    title: "Latência, throughput e percentil",
    description:
      "Tempo de uma operação vs volume. SLO se escreve em p99, não na média.",
  },
  {
    slug: "disponibilidade",
    nav: "Disponibilidade",
    title: "Disponibilidade e consistência",
    description:
      "Loja aberta versus estoque bater com a prateleira. Eventual não é mentira permanente.",
  },
  {
    slug: "cap",
    nav: "CAP",
    title: "CAP e PACELC",
    description:
      "Partição é o gatilho. No dia ensolarado o dilema é latência versus consistência.",
  },
  {
    slug: "acid",
    nav: "ACID",
    title: "ACID vs mundo distribuído",
    description:
      "Um caixa desfaz a venda. Dois caixas não compartilham a mesma borracha.",
  },
  {
    slug: "monolito",
    nav: "Monolito",
    title: "Monolito, módulo e microsserviço",
    description:
      "Um deploy modular é o default. Vários deploys com a mesma geladeira é o pior dos dois mundos.",
  },
  {
    slug: "sincrono",
    nav: "Síncrono",
    title: "Síncrono vs assíncrono",
    description:
      "Ligar e esperar versus deixar recado. Consulta na cara do usuário não é tópico.",
  },
  {
    slug: "cache",
    nav: "Cache",
    title: "Cache",
    description:
      "Post-it na mesa. Stampede, hot key e o custo de mostrar dado velho.",
  },
  {
    slug: "replicacao",
    nav: "Replicação",
    title: "Replicação vs sharding",
    description:
      "Fotocópia do livro versus fatiar por letra. Lag de réplica e hot shard.",
  },
  {
    slug: "indice",
    nav: "Índice",
    title: "Índice",
    description:
      "Acelera aquele tipo de busca e deixa a escrita mais lenta. Índice ocioso é só custo.",
  },
  {
    slug: "escala",
    nav: "Escala",
    title: "SLO e escala",
    description: "Latência, throughput, SLO, índice, replicação, sharding e cache no desenho.",
  },
  {
    slug: "resiliencia",
    nav: "Resiliência",
    title: "Comunicação e resiliência",
    description:
      "Timeout, retry, breaker, bulkhead, fallback — nesta ordem. Gateway, BFF e evolução de API.",
  },
  {
    slug: "decomposicao",
    nav: "Decomposição",
    title: "Decomposição",
    description:
      "Quando não usar microsserviços, bounded context, banco compartilhado e Strangler Fig.",
  },
  {
    slug: "dados",
    nav: "Dados",
    title: "Dados distribuídos",
    description:
      "Saga, outbox, CQRS, event sourcing e idempotência em API de pagamento.",
  },
  {
    slug: "observabilidade",
    nav: "Observabilidade",
    title: "Observabilidade",
    description: "Métrica, trace, log, SLI, SLO, error budget e alerta acionável.",
  },
  {
    slug: "system-design",
    nav: "System design",
    title: "System design",
    description:
      "Os 45 minutos de entrevista: requisitos, estimativa, feed, assento e pagamento.",
  },
  {
    slug: "staff",
    nav: "Nível Staff",
    title: "Nível big tech",
    description:
      "Células, consistência real, blast radius — o que a mesa de Staff cobra além do glossário.",
  },
  {
    slug: "catalogo",
    nav: "Catálogo",
    title: "Catálogo de componentes",
    description: "API, escala, cache, storage, pipelines e comentários — uma peça por vez.",
  },
  {
    slug: "referencia",
    nav: "Arquiteto",
    title: "Virar a referência",
    description: "Julgamento de arquiteto: ADR, recusar microsserviço cedo e review de RFC.",
  },
];

export const kafkaLessons: LessonMeta[] = lessonsFrom(
  "/kafka",
  kafkaEyebrow,
  kafkaDefs,
);

export const arquiteturaLessons: LessonMeta[] = lessonsFrom(
  "/arquitetura",
  arqEyebrow,
  arqDefs,
);

export const kafkaNav: NavItem[] = [
  { href: "/kafka", label: "Início" },
  ...kafkaDefs.map((d) => ({ href: `/kafka/${d.slug}`, label: d.nav })),
  { href: "/kafka/simulador", label: "Simulador" },
];

export const arquiteturaNav: NavItem[] = [
  { href: "/arquitetura", label: "Início" },
  ...arqDefs.map((d) => ({ href: `/arquitetura/${d.slug}`, label: d.nav })),
  { href: "/arquitetura/simulador", label: "Simulador" },
];

export const kafkaHome: LessonMeta = {
  slug: "index",
  path: "/kafka",
  title: "Apache Kafka, em páginas curtas",
  description:
    "Trilha por tema rumo a Tech Lead backend: caderno infinito, garantias, outbox e simulador de entrevista.",
  eyebrow: "Trilha 4 · rumo a Tech Lead backend",
  ogType: "website",
};

export const arquiteturaHome: LessonMeta = {
  slug: "index",
  path: "/arquitetura",
  title: "Arquitetura, em páginas curtas",
  description:
    "Trilha por tema rumo a arquiteto: mapa, system design, nível Staff e simulador de entrevista.",
  eyebrow: "Trilha 7 · rumo a Arquiteto de Software",
  ogType: "website",
};

export const kafkaSimulador: LessonMeta = {
  slug: "simulador",
  path: "/kafka/simulador",
  title: "Simulador de entrevista — Kafka",
  description: "50 perguntas, uma por vez. Sem gabarito no fim — só o mapa de gaps por tema.",
  eyebrow: kafkaEyebrow,
  ogType: "article",
};

export const arquiteturaSimulador: LessonMeta = {
  slug: "simulador",
  path: "/arquitetura/simulador",
  title: "Simulador de entrevista — Arquitetura",
  description: "60 perguntas, uma por vez. Sem gabarito no fim — só o mapa de gaps por tema.",
  eyebrow: arqEyebrow,
  ogType: "article",
};

export function findLesson(
  list: LessonMeta[],
  slug: string,
): LessonMeta | undefined {
  return list.find((l) => l.slug === slug);
}

export function neighbors(nav: NavItem[], path: string) {
  const i = nav.findIndex((n) => n.href === path);
  return {
    prev: i > 0 ? nav[i - 1] : undefined,
    next: i >= 0 && i < nav.length - 1 ? nav[i + 1] : undefined,
  };
}

export function isTrackHome(path: string) {
  return path === "/kafka" || path === "/arquitetura";
}

export function isSimuladorPath(path: string) {
  return path.endsWith("/simulador");
}

export function gatedPaths(nav: NavItem[]): string[] {
  return nav
    .filter((n) => !isTrackHome(n.href) && !isSimuladorPath(n.href))
    .map((n) => n.href);
}

export function navForPath(path: string): NavItem[] {
  if (path.startsWith("/arquitetura")) return arquiteturaNav;
  return kafkaNav;
}

export type SidebarGroup = {
  label: string;
  items: NavItem[];
};

export type SidebarTrack = {
  id: "kafka" | "arquitetura";
  href: string;
  label: string;
  nav: NavItem[];
  groups: SidebarGroup[];
};

export const sidebarTracks: SidebarTrack[] = [
  {
    id: "kafka",
    href: "/kafka",
    label: "Kafka",
    nav: kafkaNav,
    groups: [
      { label: "Começo", items: kafkaNav.slice(0, 2) },
      { label: "Conceitos", items: kafkaNav.slice(2, 13) },
      { label: "Prática", items: kafkaNav.slice(13, 18) },
      { label: "Fechamento", items: kafkaNav.slice(18) },
    ],
  },
  {
    id: "arquitetura",
    href: "/arquitetura",
    label: "Arquitetura",
    nav: arquiteturaNav,
    groups: [
      { label: "Começo", items: arquiteturaNav.slice(0, 2) },
      { label: "Conceitos", items: arquiteturaNav.slice(2, 12) },
      { label: "Temas", items: arquiteturaNav.slice(12, 17) },
      { label: "Fechamento", items: arquiteturaNav.slice(17) },
    ],
  },
];

export function trackIdFromPath(path: string): SidebarTrack["id"] | undefined {
  if (path.startsWith("/arquitetura")) return "arquitetura";
  if (path.startsWith("/kafka")) return "kafka";
  return undefined;
}

export const allPublicPaths = [
  "/",
  ...kafkaNav.map((n) => n.href),
  ...arquiteturaNav.map((n) => n.href),
];
