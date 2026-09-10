import { VisitTracker } from "@/components/VisitTracker";
import { JsonLd } from "@/components/JsonLd";
import { courseJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import Link from "next/link";

export function TrackHome({
  path,
  num,
  eyebrow,
  title,
  lede,
  cards,
  footer,
  courseName,
}: {
  path: string;
  num: string;
  eyebrow: string;
  title: string;
  lede: string;
  cards: { href: string; tag: string; title: string; blurb: string }[];
  footer: string;
  courseName: string;
}) {
  return (
    <div className="wrap">
      <VisitTracker path={path} />
      <JsonLd
        data={courseJsonLd({
          name: courseName,
          description: lede,
          url: `${SITE_URL}${path}`,
        })}
      />
      <header className="hero">
        <p className="crumb">
          <Link href="/">Trilhas</Link>
        </p>
        <div className="eyebrow">{eyebrow}</div>
        <p className="hero-num" aria-hidden="true">
          {num}
        </p>
        <h1>{title}</h1>
        <p className="lede">{lede}</p>
      </header>
      <div className="track-links">
        {cards.map((c) => (
          <Link href={c.href} key={c.href}>
            <span className="tl-tag">{c.tag}</span>
            <span>
              <span className="tl-title">{c.title}</span>
              <p className="tl-blurb">{c.blurb}</p>
            </span>
          </Link>
        ))}
      </div>
      <footer>{footer}</footer>
    </div>
  );
}
