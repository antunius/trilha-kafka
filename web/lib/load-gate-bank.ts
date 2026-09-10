import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { GateQuestion } from "./gates";

export function loadGateBank(
  track: "kafka" | "arquitetura",
  slug: string,
): GateQuestion[] {
  const file = join(process.cwd(), "data", "gates", track, `${slug}.json`);
  const data = JSON.parse(readFileSync(file, "utf8")) as {
    questions: GateQuestion[];
  };
  return data.questions;
}
