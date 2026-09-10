import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonShell } from "@/components/LessonShell";
import { findLesson, kafkaLessons, kafkaNav } from "@/lib/catalog";
import { lessonHtml } from "@/lib/content";
import { loadGateBank } from "@/lib/load-gate-bank";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return kafkaLessons.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lesson = findLesson(kafkaLessons, slug);
  if (!lesson) return {};
  return pageMetadata({
    title: lesson.title,
    description: lesson.description,
    path: lesson.path,
    ogType: lesson.ogType,
  });
}

export default async function KafkaLessonPage({ params }: Props) {
  const { slug } = await params;
  const lesson = findLesson(kafkaLessons, slug);
  if (!lesson) notFound();
  const html = lessonHtml("kafka", slug);
  const questions = loadGateBank("kafka", slug);
  return (
    <LessonShell
      trackHome="/kafka"
      trackLabel="Kafka"
      lesson={lesson}
      nav={kafkaNav}
      html={html}
      questions={questions}
      footer="Trilha Kafka por tema, rumo a Tech Lead backend."
    />
  );
}
