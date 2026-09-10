import Link from "next/link";
import type { NavItem } from "@/lib/catalog";

export function Pager({
  prev,
  next,
  nextLocked,
}: {
  prev?: NavItem;
  next?: NavItem;
  nextLocked?: boolean;
}) {
  return (
    <nav className="pager">
      {prev ? (
        <Link href={prev.href}>
          <span className="kicker">Anterior</span>
          {prev.label}
        </Link>
      ) : (
        <span />
      )}
      {next && nextLocked ? (
        <span className="next pager-locked">
          <span className="kicker">Próxima</span>
          Complete o simulador: 4 de 5
        </span>
      ) : next ? (
        <Link className="next" href={next.href}>
          <span className="kicker">Próxima</span>
          {next.label}
        </Link>
      ) : null}
    </nav>
  );
}
