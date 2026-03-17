import { useState, useCallback, useEffect } from 'react';
import { useGame } from './hooks/useGame';
import { useSheetCategory } from './hooks/useSheetCategory';
import { usePercentages } from './hooks/usePercentages';
import Header from './components/Header';
import CategoryBanner from './components/CategoryBanner';
import ScoreDisplay from './components/ScoreDisplay';
import GuessInput from './components/GuessInput';
import GuessList from './components/GuessList';
import GameOverScreen from './components/GameOverScreen';
import RulesModal from './components/RulesModal';
import YesterdayModal from './components/YesterdayModal';
import PrivacyModal from './components/PrivacyModal';
import { ShineBorder } from './components/ui/shine-border';
import type { GameState } from './types';

const RULES_SEEN_KEY = 'kategories-rules-seen';

function getDateString(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function App() {
  const { category, loading } = useSheetCategory();
  const { recordGuess, getPercentage, fetchFinalPercentagesForDate, saveResult, fetchLivePercentile } = usePercentages();
  const { gameState, submitGuess, liveScore, livePercentile, totalPlayers } = useGame(category, { recordGuess, getPercentage, saveResult, fetchLivePercentile });

  const [showRules, setShowRules] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [yesterdayResult, setYesterdayResult] = useState<{ score: number; correctGuesses: number } | null>(null);
  const [showYesterday, setShowYesterday] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // On load: check for yesterday's completed game and compute final score
  useEffect(() => {
    const yesterday = getDateString(-1);
    const yesterdayKey = `kategories-${yesterday}`;
    const shownKey = `kategories-yesterday-shown-${yesterday}`;

    // Only show once per day
    if (localStorage.getItem(shownKey)) return;

    try {
      const saved = localStorage.getItem(yesterdayKey);
      if (!saved) return;
      const state = JSON.parse(saved) as GameState;
      if (!state.guesses || state.guesses.length === 0) return;

      fetchFinalPercentagesForDate(yesterday).then((finalPcts) => {
        const finalScore =
          Math.round(
            state.guesses.reduce(
              (sum, g) => sum + (finalPcts[g.playerName.toLowerCase()] ?? g.percentage),
              0
            ) * 100
          ) / 100;
        setYesterdayResult({ score: finalScore, correctGuesses: state.guesses.length });
        setShowYesterday(true);
      });
    } catch { /* ignore */ }
  }, [fetchFinalPercentagesForDate]);

  const handleCloseYesterday = useCallback(() => {
    const yesterday = getDateString(-1);
    localStorage.setItem(`kategories-yesterday-shown-${yesterday}`, 'true');
    setShowYesterday(false);
  }, []);

  const handleCloseRules = useCallback(() => {
    setShowRules(false);
    localStorage.setItem(RULES_SEEN_KEY, 'true');
  }, []);

  const handleGuess = useCallback(
    (input: string) => {
      const { result, playerName } = submitGuess(input);
      if (result === 'duplicate') {
        setMessage(`You already guessed ${playerName}!`);
        setTimeout(() => setMessage(null), 2000);
      } else {
        setMessage(null);
      }
    },
    [submitGuess]
  );

  const isEliminated = gameState.status === 'eliminated';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-kat-blue text-xl font-bold animate-pulse">Loading today's KATegory…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-8">
      <ShineBorder
        color={["#1e3a5f", "#f97316", "#1e3a5f"]}
        borderWidth={2}
        borderRadius={16}
        duration={10}
        className="!w-[92vw] sm:!w-[70vw] !min-w-0 mx-auto rounded-2xl !bg-white !p-0 overflow-hidden min-h-[calc(100vh-4rem)] border-4 border-kat-orange"
      >
        <div className="w-full px-4 pb-8">
          <Header onShowRules={() => setShowRules(true)} />

          <CategoryBanner category={category.category} />

          <ScoreDisplay
            score={liveScore}
            guessCount={gameState.guesses.length}
          />

          <GuessInput
            onSubmit={handleGuess}
            disabled={isEliminated}
            message={message}
          />

          {isEliminated && (
            <GameOverScreen
              liveScore={liveScore}
              livePercentile={livePercentile}
              correctGuesses={gameState.guesses.length}
              totalPlayers={totalPlayers}
              wrongGuess={gameState.wrongGuess}
            />
          )}

          <GuessList guesses={gameState.guesses} getPercentage={getPercentage} />
        </div>
      </ShineBorder>

      {/* Footer */}
      <div className="text-center mt-4 pb-4">
        <button
          onClick={() => setShowPrivacy(true)}
          className="text-xs text-kat-gray-dark hover:text-kat-blue transition-colors underline underline-offset-2"
        >
          Privacy Policy
        </button>
      </div>

      <RulesModal isOpen={showRules} onClose={handleCloseRules} />
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />

      {yesterdayResult && (
        <YesterdayModal
          isOpen={showYesterday}
          onClose={handleCloseYesterday}
          score={yesterdayResult.score}
          correctGuesses={yesterdayResult.correctGuesses}
        />
      )}
    </div>
  );
}

export default App;
