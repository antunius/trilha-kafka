"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSidebar } from "@/components/sidebar-context";
import {
  isTrackHome,
  sidebarTracks,
  trackIdFromPath,
  type SidebarTrack,
} from "@/lib/catalog";
import {
  isLessonUnlocked,
  loadProgress,
  passedPaths,
  trackProgress,
} from "@/lib/progress";

export function AppSidebar() {
  const path = usePathname();
  const { open, setOpen } = useSidebar();
  const activeTrackId = trackIdFromPath(path);
  const [query, setQuery] = useState("");
  const [passed, setPassed] = useState<Set<string>>(new Set());
  const [openTracks, setOpenTracks] = useState<Record<string, boolean>>({
    kafka: true,
    arquitetura: true,
  });
  const [progress, setProgress] = useState({ done: 0, total: 1, pct: 0 });

  useEffect(() => {
    setQuery("");
    if (activeTrackId) {
      setOpenTracks({
        kafka: activeTrackId === "kafka",
        arquitetura: activeTrackId === "arquitetura",
      });
    } else {
      setOpenTracks({ kafka: true, arquitetura: true });
    }
  }, [path, activeTrackId]);

  useEffect(() => {
    function sync() {
      const state = loadProgress();
      setPassed(passedPaths(state));
      const active = sidebarTracks.find((t) => t.id === activeTrackId);
      const paths = active
        ? active.nav.map((n) => n.href)
        : sidebarTracks.flatMap((t) => t.nav.map((n) => n.href));
      setProgress(trackProgress(active?.href ?? "/", paths));
    }
    sync();
    window.addEventListener("trilhas-progress", sync);
    return () => window.removeEventListener("trilhas-progress", sync);
  }, [path, activeTrackId]);

  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return sidebarTracks;
    return sidebarTracks
      .map((track) => {
        const trackHit = track.label.toLowerCase().includes(q);
        const groups = track.groups
          .map((group) => ({
            ...group,
            items: trackHit
              ? group.items
              : group.items.filter((item) =>
                  item.label.toLowerCase().includes(q),
                ),
          }))
          .filter((group) => group.items.length > 0);
        return { ...track, groups };
      })
      .filter((track) => track.groups.length > 0);
  }, [q]);

  function toggleTrack(id: string) {
    setOpenTracks((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const levelLabel = activeTrackId
    ? sidebarTracks.find((t) => t.id === activeTrackId)?.label
    : "Trilhas";

  return (
    <aside
      id="site-sidebar"
      className={`app-sidebar${open ? " open" : ""}`}
      data-track={activeTrackId}
      aria-label="Trilhas e conteúdos"
    >
      <div className="sidebar-progress">
        <p className="sidebar-level">
          {activeTrackId ? `Você está em ${levelLabel}` : "Duas trilhas"}
        </p>
        <div className="home-progress">
          <div className="bar" aria-hidden="true">
            <i style={{ width: `${progress.pct}%` }} />
          </div>
          <p>
            {progress.pct}% · {progress.done} de {progress.total} aulas
          </p>
        </div>
      </div>

      <div className="sidebar-search">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar…"
          aria-label="Buscar aula"
        />
      </div>

      <nav className="sidebar-tree">
        {filtered.map((track) => (
          <TrackBlock
            key={track.id}
            track={track}
            expanded={Boolean(q) || Boolean(openTracks[track.id])}
            onToggle={() => toggleTrack(track.id)}
            activeHref={path}
            passed={passed}
            onNavigate={() => setOpen(false)}
          />
        ))}
        {filtered.length === 0 ? (
          <p className="sidebar-empty">Nada encontrado.</p>
        ) : null}
      </nav>
    </aside>
  );
}

function TrackBlock({
  track,
  expanded,
  onToggle,
  activeHref,
  passed,
  onNavigate,
}: {
  track: SidebarTrack;
  expanded: boolean;
  onToggle: () => void;
  activeHref: string;
  passed: Set<string>;
  onNavigate: () => void;
}) {
  const panelId = `sidebar-${track.id}`;
  return (
    <div className="sidebar-track" data-track={track.id}>
      <button
        type="button"
        className="sidebar-track-btn"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span>{track.label}</span>
        <span className={`chevron${expanded ? " open" : ""}`} aria-hidden="true">
          ›
        </span>
      </button>
      {expanded ? (
        <div id={panelId} className="sidebar-groups">
          {track.groups.map((group) => (
            <div key={group.label} className="sidebar-group">
              <p className="sidebar-group-label">{group.label}</p>
              <ul>
                {group.items.map((item) => {
                  const active = activeHref === item.href;
                  const done = passed.has(item.href) || isTrackHome(item.href);
                  const unlocked = isLessonUnlocked(track.nav, item.href, passed);
                  const className = `sidebar-link${active ? " active" : ""}${
                    unlocked ? "" : " locked"
                  }`;
                  return (
                    <li key={item.href}>
                      {unlocked ? (
                        <Link
                          href={item.href}
                          className={className}
                          aria-current={active ? "page" : undefined}
                          onClick={onNavigate}
                        >
                          <span
                            className={`dot${done ? " done" : ""}`}
                            aria-hidden="true"
                          />
                          {item.label}
                        </Link>
                      ) : (
                        <span
                          className={className}
                          aria-disabled="true"
                          title="Passe o simulador da aula anterior (4 de 5)"
                        >
                          <span className="dot" aria-hidden="true" />
                          {item.label}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
