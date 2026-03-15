interface YesterdayModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  correctGuesses: number;
}

export default function YesterdayModal({ isOpen, onClose, score, correctGuesses }: YesterdayModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 animate-scale-in shadow-xl">
        <h2 className="text-xl font-black text-kat-blue mb-1 text-center">Yesterday's Final Score</h2>
        <p className="text-xs text-center text-kat-gray-dark uppercase tracking-widest mb-5">
          All players have guessed — here's how you finished
        </p>

        <div className="flex gap-3 mb-5">
          <div className="flex-1 bg-kat-orange rounded-xl py-4 text-center">
            <p className="text-4xl font-black text-white">{score}</p>
            <p className="text-xs font-semibold text-white/80 uppercase tracking-widest mt-1">Final Score</p>
          </div>
          <div className="flex-1 bg-kat-blue rounded-xl py-4 text-center">
            <p className="text-4xl font-black text-white">{correctGuesses}</p>
            <p className="text-xs font-semibold text-white/80 uppercase tracking-widest mt-1">Correct</p>
          </div>
        </div>

        <p className="text-xs text-center text-kat-gray-dark mb-5">
          Scores update throughout the day as more players guess. This is your finalized result.
        </p>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-kat-blue text-white font-bold rounded-xl hover:opacity-90 transition-opacity text-sm tracking-wide"
        >
          See Today's KATegory
        </button>
      </div>
    </div>
  );
}
