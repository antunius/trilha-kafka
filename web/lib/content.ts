import { readFileSync } from "node:fs";
import { join } from "node:path";

export function lessonHtml(
  track: "kafka" | "arquitetura",
  slug: string,
): string {
  return readFileSync(
    join(process.cwd(), "content", track, `${slug}.html`),
    "utf8",
  );
}
