import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/kafka/fundamentos", destination: "/kafka/modelo-mental", permanent: true },
      { source: "/kafka/semana-1", destination: "/kafka/particao", permanent: true },
      { source: "/kafka/semana-2", destination: "/kafka/garantias", permanent: true },
      { source: "/kafka/semana-3", destination: "/kafka/operacao", permanent: true },
      { source: "/kafka/semana-4", destination: "/kafka/outbox", permanent: true },
      { source: "/kafka/semana-5", destination: "/kafka/spring", permanent: true },
      { source: "/kafka/semana-6", destination: "/kafka/sintese", permanent: true },
      { source: "/kafka/referencia", destination: "/kafka/tech-lead", permanent: true },
      { source: "/arquitetura/fundamentos", destination: "/arquitetura/mapa", permanent: true },
      { source: "/arquitetura/semana-1", destination: "/arquitetura/escala", permanent: true },
      { source: "/arquitetura/semana-2", destination: "/arquitetura/resiliencia", permanent: true },
      { source: "/arquitetura/semana-3", destination: "/arquitetura/decomposicao", permanent: true },
      { source: "/arquitetura/semana-4", destination: "/arquitetura/dados", permanent: true },
      { source: "/arquitetura/semana-5", destination: "/arquitetura/observabilidade", permanent: true },
    ];
  },
};

export default nextConfig;
