interface ScoreDisplayProps {
  score: number;
  guessCount: number;
}

export default function ScoreDisplay({ score, guessCount }: ScoreDisplayProps) {
  return (
    <div className="flex gap-3 mt-3">
      <div className="flex-1 text-center py-5 bg-kat-blue rounded-xl shadow-sm">
        <p className="text-5xl font-black text-white">{score}</p>
        <p className="text-sm font-bold text-blue-200 uppercase tracking-widest mt-1">Score</p>
      </div>
      <div className="flex-1 text-center py-5 bg-kat-orange rounded-xl shadow-sm">
        <p className="text-5xl font-black text-white">{guessCount}</p>
        <p className="text-sm font-bold text-orange-100 uppercase tracking-widest mt-1">Correct</p>
      </div>
    </div>
  );
}
