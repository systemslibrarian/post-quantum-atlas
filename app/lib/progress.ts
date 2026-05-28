// app/lib/progress.ts
"use client";

const STORAGE_KEY = "pqc-learning-progress";

export function getCompleted(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markComplete(moduleId: string, lessonId: string): string[] {
  const key = `${moduleId}/${lessonId}`;
  const completed = getCompleted();
  if (!completed.includes(key)) {
    completed.push(key);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  }
  return completed;
}

export function isComplete(moduleId: string, lessonId: string): boolean {
  return getCompleted().includes(`${moduleId}/${lessonId}`);
}

export function getModuleProgress(moduleId: string, totalLessons: number): number {
  const completed = getCompleted().filter(k => k.startsWith(`${moduleId}/`));
  return totalLessons > 0 ? Math.round((completed.length / totalLessons) * 100) : 0;
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
