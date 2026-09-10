export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://trilhas-backend.vercel.app";

export const SITE_NAME = "Trilhas Backend";
export const SITE_DESCRIPTION =
  "Kafka e arquitetura de software em linguagem de leigo: uma página por tema, simulador com cadeado e mesa de entrevista.";
