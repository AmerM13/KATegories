const START_DATE = new Date(2026, 2, 15); // March 15, 2026

export function getTodaysCategoryIndex(totalCategories: number): number {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.floor(
    (today.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24)
  );
  return ((diffDays % totalCategories) + totalCategories) % totalCategories;
}

export function getTodayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `kategories-${y}-${m}-${d}`;
}
