import type { Guess } from '../types';

interface GuessRowProps {
  guess: Guess;
  index: number;
  displayPercentage: number;
}

export default function GuessRow({ guess, index, displayPercentage }: GuessRowProps) {
  return (
    <div
      className="flex items-center justify-between px-5 py-4 animate-fade-in border-2 border-dashed border-kat-blue/40 rounded-xl mb-2 bg-white/70"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <span className="font-semibold text-kat-black text-base">
        {guess.playerName}
      </span>
      <span className="font-bold text-kat-orange text-base tabular-nums">
        {displayPercentage.toFixed(2)}%
      </span>
    </div>
  );
}
