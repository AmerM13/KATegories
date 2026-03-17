import { useState, useEffect } from 'react';
import { categories as fallbackCategories } from '../data/categories';
import { scheduledCategories } from '../data/scheduledCategories';
import type { Category } from '../types';

const SHEET_URL = import.meta.env.VITE_SHEETS_CSV_URL as string | undefined;

function getTodayString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Parses a CSV row, handling quoted fields that may contain commas
function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    if (row[i] === '"') {
      inQuotes = !inQuotes;
    } else if (row[i] === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += row[i];
    }
  }
  result.push(current.trim());
  return result;
}

function buildCategoryFromRow(row: string[]): Category | null {
  const [date, categoryName, playersStr, percentagesStr] = row;
  if (!date || !categoryName || !playersStr) return null;

  const playerNames = playersStr.split('|').map(s => s.trim()).filter(Boolean);
  const percentages = percentagesStr
    ? percentagesStr.split('|').map(s => parseFloat(s.trim()))
    : [];

  return {
    category: categoryName,
    players: playerNames.map((name, i) => ({
      name,
      aliases: [name],
      percentage: percentages[i] ?? 10,
    })),
    simulatedPercentiles: {
      0: 5, 200: 20, 400: 35, 600: 50,
      800: 65, 1000: 78, 1200: 87, 1500: 93, 2000: 98,
    },
  };
}

export function useSheetCategory(): { category: Category; loading: boolean } {
  const today = getTodayString();
  const cacheKey = `kategories-sheet-${today}`;
  const fallback = scheduledCategories[today] ?? fallbackCategories[0];

  const [category, setCategory] = useState<Category>(() => {
    // Scheduled categories always take priority over cache
    if (scheduledCategories[today]) return scheduledCategories[today];
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached) as Category;
    } catch { /* ignore */ }
    return fallback;
  });

  const [loading, setLoading] = useState(() => {
    if (!SHEET_URL) return false;
    try {
      return !localStorage.getItem(cacheKey);
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!SHEET_URL) return;

    // Already loaded from cache
    try {
      if (localStorage.getItem(cacheKey)) return;
    } catch { /* ignore */ }

    fetch(SHEET_URL)
      .then(r => r.text())
      .then(text => {
        const rows = text.trim().split('\n').map(parseCSVRow);
        // rows[0] is the header, search the rest
        const todayRow = rows.slice(1).find(r => r[0] === today);
        if (!todayRow) return;
        const cat = buildCategoryFromRow(todayRow);
        if (!cat) return;
        try {
          localStorage.setItem(cacheKey, JSON.stringify(cat));
        } catch { /* ignore */ }
        setCategory(cat);
      })
      .catch(() => { /* stay on fallback */ })
      .finally(() => setLoading(false));
  }, [cacheKey, today]);

  return { category, loading };
}
