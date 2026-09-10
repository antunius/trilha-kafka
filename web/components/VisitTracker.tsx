"use client";

import { useEffect } from "react";
import { markVisited } from "@/lib/progress";

export function VisitTracker({ path }: { path: string }) {
  useEffect(() => {
    markVisited(path);
  }, [path]);
  return null;
}
