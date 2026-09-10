import { VisitTracker } from "@/components/VisitTracker";
import { JsonLd } from "@/components/JsonLd";
import { LessonView } from "@/components/LessonView";
import type { LessonMeta, NavItem } from "@/lib/catalog";
import { articleJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import type { GateQuestion } from "@/lib/gates";
import Link from "next/link";

export function LessonShell({
  trackHome,
  trackLabel,
  lesson,
  nav,
  html,
  footer,
  questions,
}: {
  trackHome: string;
  trackLabel: string;
  lesson: LessonMeta;
  nav: NavItem[];
  html: string;
  footer: string;
  questions: GateQuestion[];
}) {
  return (
    <div className="wrap">
      <VisitTracker path={lesson.path} />
      <JsonLd
        data={articleJsonLd({
          headline: lesson.title,
          description: lesson.description,
          url: `${SITE_URL}${lesson.path}`,
        })}
      />
      <header className="hero">
        <p className="crumb">
          <Link href="/">Trilhas</Link> · <Link href={trackHome}>{trackLabel}</Link>
        </p>
        <div className="eyebrow">{lesson.eyebrow}</div>
        <h1>{lesson.title}</h1>
        <p className="lede">{lesson.description}</p>
      </header>
      <LessonView lesson={lesson} nav={nav} html={html} questions={questions} />
      <footer>{footer}</footer>
    </div>
  );
}
