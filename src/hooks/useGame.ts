import { useState, useCallback, useMemo, useEffect } from 'react';
import { getTodayKey } from '../utils/dateUtils';
import { findPlayer } from '../utils/nameMatch';
import type { Category, GameState, Guess } from '../types';

const STORAGE_KEY = getTodayKey();

function loadSavedState(): GameState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as GameState;
  } catch { /* ignore */ }
  return null;
}

function saveState(state: GameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Fallback percentile interpolation used until real data is available
function interpolatePercentile(
  score: number,
  distribution: Record<number, number>
): number {
  const thresholds = Object.keys(distribution).map(Number).sort((a, b) => a - b);
  if (score <= thresholds[0]) return distribution[thresholds[0]];
  if (score >= thresholds[thresholds.length - 1]) return distribution[thresholds[thresholds.length - 1]];
  for (let i = 0; i < thresholds.length - 1; i++) {
    const low = thresholds[i];
    const high = thresholds[i + 1];
    if (score >= low && score <= high) {
      const ratio = (score - low) / (high - low);
      return Math.round(distribution[low] + ratio * (distribution[high] - distribution[low]));
    }
  }
  return 50;
}

export function useGame(
  category: Category,
  {
    recordGuess,
    getPercentage,
    saveResult,
    fetchLivePercentile,
  }: {
    recordGuess: (playerName: string) => void;
    getPercentage: (name: string, fallback: number) => number;
    saveResult: (score: number, correctGuesses: number) => Promise<void>;
    fetchLivePercentile: (score: number) => Promise<number | null>;
  }
) {
  const [gameState, setGameState] = useState<GameState>(() => {
    return loadSavedState() ?? { status: 'playing', guesses: [], score: 0 };
  });

  const [livePercentile, setLivePercentile] = useState<number>(() =>
    interpolatePercentile(0, category.simulatedPercentiles)
  );

  const guessedNames = useMemo(
    () => new Set(gameState.guesses.map((g) => g.playerName.toLowerCase())),
    [gameState.guesses]
  );

  // Rarity scoring: rare players (low %) = more points. Score = sum of (100 - guessRate) per player.
  const liveScore = useMemo(
    () =>
      Math.round(
        gameState.guesses.reduce(
          (sum, g) => sum + (100 - getPercentage(g.playerName, g.percentage)),
          0
        ) * 100
      ) / 100,
    [gameState.guesses, getPercentage]
  );

  // When eliminated: save result to Supabase and fetch real percentile; update as liveScore changes
  useEffect(() => {
    if (gameState.status !== 'eliminated') return;
    saveResult(liveScore, gameState.guesses.length);
    fetchLivePercentile(liveScore).then((real) => {
      setLivePercentile(
        real !== null ? real : interpolatePercentile(liveScore, category.simulatedPercentiles)
      );
    });
  }, [liveScore, gameState.status, gameState.guesses.length, saveResult, fetchLivePercentile, category.simulatedPercentiles]);

  const submitGuess = useCallback(
    (input: string): { result: 'correct' | 'duplicate' | 'wrong'; playerName?: string } => {
      const player = findPlayer(input, category.players);

      if (player && guessedNames.has(player.name.toLowerCase())) {
        return { result: 'duplicate', playerName: player.name };
      }

      if (player) {
        const newGuess: Guess = {
          playerName: player.name,
          percentage: player.percentage,
        };
        const newState: GameState = {
          status: 'playing',
          guesses: [newGuess, ...gameState.guesses],
          score: 0,
        };
        saveState(newState);
        setGameState(newState);
        recordGuess(player.name);
        return { result: 'correct', playerName: player.name };
      }

      // Wrong guess — game over
      const newState: GameState = {
        status: 'eliminated',
        guesses: gameState.guesses,
        score: liveScore,
        wrongGuess: input.trim(),
      };
      saveState(newState);
      setGameState(newState);
      return { result: 'wrong' };
    },
    [category, gameState, guessedNames, recordGuess, liveScore]
  );

  return {
    category,
    gameState,
    submitGuess,
    totalPlayers: category.players.length,
    liveScore,
    livePercentile,
  };
}
