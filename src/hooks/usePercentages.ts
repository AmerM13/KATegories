import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

function getSessionId(): string {
  let id = localStorage.getItem('kategories-session-id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('kategories-session-id', id);
  }
  return id;
}

function getDateString(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

async function fetchPercentagesForDate(date: string): Promise<Record<string, number>> {
  if (!supabase) return {};

  const { data, error } = await supabase
    .from('guess_events')
    .select('player_name, session_id')
    .eq('game_date', date);

  if (error || !data || data.length === 0) return {};

  const uniqueSessions = new Set(data.map((r) => r.session_id)).size;
  if (uniqueSessions === 0) return {};

  const counts: Record<string, number> = {};
  for (const row of data) {
    const key = row.player_name.toLowerCase();
    counts[key] = (counts[key] ?? 0) + 1;
  }

  const pcts: Record<string, number> = {};
  for (const [name, count] of Object.entries(counts)) {
    pcts[name] = Math.round((count / uniqueSessions) * 10000) / 100;
  }
  return pcts;
}

export function usePercentages() {
  const [livePercentages, setLivePercentages] = useState<Record<string, number>>({});
  const today = getDateString(0);

  useEffect(() => {
    fetchPercentagesForDate(today).then((pcts) => {
      if (Object.keys(pcts).length > 0) setLivePercentages(pcts);
    });
  }, [today]);

  const recordGuess = useCallback(async (playerName: string) => {
    if (!supabase) return;
    const sessionId = getSessionId();
    await supabase.from('guess_events').insert(
      { game_date: today, player_name: playerName, session_id: sessionId }
    );
    const pcts = await fetchPercentagesForDate(today);
    if (Object.keys(pcts).length > 0) setLivePercentages(pcts);
  }, [today]);

  const getPercentage = useCallback(
    (playerName: string, fallback: number): number => {
      const key = playerName.toLowerCase();
      return key in livePercentages ? livePercentages[key] : fallback;
    },
    [livePercentages]
  );

  const fetchFinalPercentagesForDate = useCallback(
    async (date: string): Promise<Record<string, number>> => {
      return fetchPercentagesForDate(date);
    },
    []
  );

  // Save/update the player's final result for today — called whenever liveScore changes after elimination
  const saveResult = useCallback(async (score: number, correctGuesses: number) => {
    if (!supabase) return;
    const sessionId = getSessionId();
    await supabase.from('game_results').upsert(
      { game_date: today, session_id: sessionId, score, correct_guesses: correctGuesses },
      { onConflict: 'game_date,session_id' }
    );
  }, [today]);

  // Fetch real percentile: % of today's completed games with score < this score
  const fetchLivePercentile = useCallback(async (score: number): Promise<number | null> => {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('game_results')
      .select('score')
      .eq('game_date', today);
    if (error || !data || data.length === 0) return null;
    const below = data.filter((r) => r.score < score).length;
    return Math.round((below / data.length) * 100);
  }, [today]);

  return { recordGuess, getPercentage, fetchFinalPercentagesForDate, saveResult, fetchLivePercentile };
}
