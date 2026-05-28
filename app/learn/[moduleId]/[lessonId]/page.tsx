// app/learn/[moduleId]/[lessonId]/page.tsx
import { modules } from "../../../lib/curriculum";
import LessonClient from "./lesson-client";

export function generateStaticParams() {
  const params: { moduleId: string; lessonId: string }[] = [];
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      params.push({ moduleId: mod.id, lessonId: lesson.id });
    }
  }
  return params;
}

export default function LessonPage({ params }: { params: Promise<{ moduleId: string; lessonId: string }> }) {
  return <LessonClient params={params} />;
}
