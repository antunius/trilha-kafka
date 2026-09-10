import {
  gatedPaths,
  isSimuladorPath,
  isTrackHome,
  type NavItem,
} from "./catalog";

export const PROGRESS_KEY = "trilhas-progress-v2";

export type GateRecord = { passed: true; at: number };

export type ProgressState = {
  visited: string[];
  lastPath?: string;
  quiz?: Record<string, number>;
  gates?: Record<string, GateRecord>;
  sessions?: Record<string, boolean[]>;
};

export function emptyProgress(): ProgressState {
  return { visited: [], quiz: {}, gates: {}, sessions: {} };
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "null");
    if (!raw || typeof raw !== "object") return emptyProgress();
    return {
      visited: Array.isArray(raw.visited) ? raw.visited : [],
      lastPath: typeof raw.lastPath === "string" ? raw.lastPath : undefined,
      quiz: raw.quiz && typeof raw.quiz === "object" ? raw.quiz : {},
      gates: raw.gates && typeof raw.gates === "object" ? raw.gates : {},
      sessions:
        raw.sessions && typeof raw.sessions === "object" ? raw.sessions : {},
    };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(state: ProgressState) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("trilhas-progress"));
  }
}

export function markVisited(path: string) {
  const state = loadProgress();
  if (!state.visited.includes(path)) state.visited.push(path);
  state.lastPath = path;
  saveProgress(state);
}

export function passedPaths(state: ProgressState = loadProgress()): Set<string> {
  return new Set(
    Object.entries(state.gates || {})
      .filter(([, g]) => g && g.passed)
      .map(([p]) => p),
  );
}

export function markGatePassed(path: string) {
  const state = loadProgress();
  state.gates = { ...state.gates, [path]: { passed: true, at: Date.now() } };
  saveProgress(state);
}

export function isLessonUnlocked(
  nav: NavItem[],
  path: string,
  passed: Set<string> = passedPaths(),
): boolean {
  if (path === "/" || isTrackHome(path)) return true;
  const gated = gatedPaths(nav);
  if (isSimuladorPath(path)) {
    const last = gated[gated.length - 1];
    return Boolean(last && passed.has(last));
  }
  const i = gated.indexOf(path);
  if (i === -1) return true;
  if (i === 0) return true;
  return gated.slice(0, i).every((p) => passed.has(p));
}

export function firstPendingPath(
  nav: NavItem[],
  passed: Set<string> = passedPaths(),
): string | undefined {
  return gatedPaths(nav).find((p) => !passed.has(p));
}

export function trackProgress(_trackPrefix: string, paths: string[]) {
  const state = loadProgress();
  const passed = passedPaths(state);
  const gated = paths.filter((p) => !isTrackHome(p) && !isSimuladorPath(p));
  const total = gated.length || 1;
  const done = gated.filter((p) => passed.has(p)).length;
  return { done, total, pct: Math.round((done / total) * 100) };
}
