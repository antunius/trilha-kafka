"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSidebar } from "@/components/sidebar-context";
import { trackIdFromPath } from "@/lib/catalog";

export function SiteHeader() {
  const path = usePathname();
  const { open, toggle } = useSidebar();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const current = ready ? path : "";
  const track = trackIdFromPath(current);

  return (
    <header className="site-header" data-track={track}>
      <div className="inner">
        <Link href="/" className="site-logo">
          Trilhas
        </Link>
        <button
          type="button"
          className="sidebar-toggle"
          aria-expanded={open}
          aria-controls="site-sidebar"
          aria-label={open ? "Fechar índice" : "Abrir índice"}
          onClick={toggle}
        >
          <span aria-hidden="true">{open ? "×" : "☰"}</span>
        </button>
      </div>
    </header>
  );
}
