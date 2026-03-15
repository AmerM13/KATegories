interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RulesModal({ isOpen, onClose }: RulesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 animate-scale-in shadow-xl">
        <h2 className="text-xl font-black text-kat-blue mb-1 text-center">How to Play</h2>
        <p className="text-xs text-center text-kat-gray-dark uppercase tracking-widest mb-5">KATegories</p>

        <div className="space-y-3 text-sm text-kat-black">
          <div className="flex gap-3 items-start">
            <span className="text-kat-orange font-black text-base leading-snug">1</span>
            <p className="leading-snug">A new <strong>NBA category</strong> is revealed each day.</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-kat-orange font-black text-base leading-snug">2</span>
            <p className="leading-snug">Guess as many <strong>players</strong> as you can that fit the category.</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-kat-orange font-black text-base leading-snug">3</span>
            <p className="leading-snug">Each correct guess shows the <strong>% of today's players</strong> who guessed that player. <strong>Rarer players score more</strong> — if only 5% guessed them, you get 95 points. Scores update live throughout the day.</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-red-500 font-black text-base leading-snug">!</span>
            <p className="leading-snug">One <strong>wrong guess</strong> ends the game.</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 bg-kat-orange text-white font-bold rounded-xl hover:bg-kat-orange-light transition-colors text-sm tracking-wide"
        >
          Let's Play!
        </button>
      </div>
    </div>
  );
}
