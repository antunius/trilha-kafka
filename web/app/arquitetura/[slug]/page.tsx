import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonShell } from "@/components/LessonShell";
import { arquiteturaLessons, arquiteturaNav, findLesson } from "@/lib/catalog";
import { lessonHtml } from "@/lib/content";
import { loadGateBank } from "@/lib/load-gate-bank";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return arquiteturaLessons.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lesson = findLesson(arquiteturaLessons, slug);
  if (!lesson) return {};
  return pageMetadata({
    title: lesson.title,
    description: lesson.description,
    path: lesson.path,
    ogType: lesson.ogType,
  });
}

export default async function ArquiteturaLessonPage({ params }: Props) {
  const { slug } = await params;
  const lesson = findLesson(arquiteturaLessons, slug);
  if (!lesson) notFound();
  const html = lessonHtml("arquitetura", slug);
  const questions = loadGateBank("arquitetura", slug);
  return (
    <LessonShell
      trackHome="/arquitetura"
      trackLabel="Arquitetura"
      lesson={lesson}
      nav={arquiteturaNav}
      html={html}
      questions={questions}
      footer="Trilha de Arquitetura por tema, rumo a Arquiteto de Software."
    />
  );
}
