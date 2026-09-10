"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/AppSidebar";
import { SiteHeader } from "@/components/SiteHeader";
import { SidebarContext } from "@/components/sidebar-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    document.body.classList.toggle("sidebar-open", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("sidebar-open");
    };
  }, [open]);

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const value = useMemo(() => ({ open, setOpen, toggle }), [open, toggle]);

  return (
    <SidebarContext.Provider value={value}>
      <SiteHeader />
      <div className="app-shell">
        {open ? (
          <button
            type="button"
            className="sidebar-backdrop"
            aria-label="Fechar índice"
            onClick={() => setOpen(false)}
          />
        ) : null}
        <AppSidebar />
        <main className="app-main">{children}</main>
      </div>
    </SidebarContext.Provider>
  );
}
