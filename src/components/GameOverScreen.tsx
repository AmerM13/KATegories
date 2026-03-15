interface GameOverScreenProps {
  liveScore: number;
  livePercentile: number;
  correctGuesses: number;
  totalPlayers: number;
  wrongGuess?: string;
}

export default function GameOverScreen({
  liveScore,
  livePercentile,
  correctGuesses,
  totalPlayers,
  wrongGuess,
}: GameOverScreenProps) {
  return (
    <div className="mt-3 animate-scale-in">
      <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        {/* Header */}
        <div className="bg-kat-blue px-6 py-4 text-white text-center">
          <h2 className="text-lg font-black tracking-wide">GAME OVER</h2>
          {wrongGuess && (
            <p className="text-xs opacity-70 mt-1">
              <span className="font-semibold text-kat-orange">{wrongGuess}</span> is not in today's category
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="flex border-b border-gray-200">
          <div className="flex-1 text-center py-4 border-r border-gray-200">
            <p className="text-4xl font-black text-kat-orange">{Number.isInteger(liveScore) ? liveScore : liveScore.toFixed(2)}</p>
            <p className="text-xs font-semibold text-kat-gray-dark uppercase tracking-widest mt-1">Final Score</p>
          </div>
          <div className="flex-1 text-center py-4">
            <p className="text-4xl font-black text-kat-blue">{correctGuesses}<span className="text-lg font-bold text-kat-gray-dark">/{totalPlayers}</span></p>
            <p className="text-xs font-semibold text-kat-gray-dark uppercase tracking-widest mt-1">Correct</p>
          </div>
        </div>

        {/* Percentile */}
        <div className="px-6 py-4 text-center">
          <p className="text-xs font-semibold text-kat-gray-dark uppercase tracking-widest mb-3">Your Percentile</p>
          <p className="text-3xl font-black text-kat-blue mb-1">{livePercentile}<span className="text-lg font-bold text-kat-gray-dark">th</span></p>
          <p className="text-xs text-kat-gray-dark">Better than {livePercentile}% of players</p>
        </div>

        <div className="px-6 pb-4 text-center">
          <p className="text-xs text-kat-gray-dark font-semibold">Your score updates live as more players guess today.</p>
          <p className="text-xs text-kat-gray-dark mt-1">Come back tomorrow to see your <strong>finalized score</strong> and a new KATegory!</p>
        </div>
      </div>
    </div>
  );
}
