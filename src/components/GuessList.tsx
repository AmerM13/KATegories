import type { Guess } from '../types';
import GuessRow from './GuessRow';

interface GuessListProps {
  guesses: Guess[];
  getPercentage: (name: string, fallback: number) => number;
}

export default function GuessList({ guesses, getPercentage }: GuessListProps) {
  if (guesses.length === 0) {
    return (
      <div className="mt-4 text-center">
        <p className="text-sm text-kat-gray-dark">Your guesses will appear here</p>
      </div>
    );
  }

  return (
    <div className="mt-3 max-h-[calc(100vh-420px)] overflow-y-auto">
      {guesses.map((guess, i) => (
        <GuessRow
          key={guess.playerName}
          guess={guess}
          index={i}
          displayPercentage={getPercentage(guess.playerName, guess.percentage)}
        />
      ))}
    </div>
  );
}
