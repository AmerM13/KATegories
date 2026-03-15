interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 animate-scale-in shadow-xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-black text-kat-blue mb-1 text-center">Privacy Policy</h2>
        <p className="text-xs text-center text-kat-gray-dark uppercase tracking-widest mb-5">KATegories</p>

        <div className="space-y-4 text-sm text-kat-black">
          <div>
            <p className="font-bold text-kat-blue mb-1">What we collect</p>
            <p className="text-kat-gray-dark leading-snug">KATegories stores an anonymous session ID in your browser to track your guesses and score for the day. No name, email, or personal information is ever collected.</p>
          </div>

          <div>
            <p className="font-bold text-kat-blue mb-1">How we use it</p>
            <p className="text-kat-gray-dark leading-snug">Your guesses are used to calculate the percentage of players who guessed each answer, and to compute your percentile ranking against other players. All data is anonymous and aggregated.</p>
          </div>

          <div>
            <p className="font-bold text-kat-blue mb-1">Data storage</p>
            <p className="text-kat-gray-dark leading-snug">Game data is stored securely via Supabase. Your game progress is also saved locally in your browser's localStorage so you can resume across page refreshes.</p>
          </div>

          <div>
            <p className="font-bold text-kat-blue mb-1">Third parties</p>
            <p className="text-kat-gray-dark leading-snug">We do not sell, share, or transfer your data to any third parties. No advertising trackers or analytics scripts are used.</p>
          </div>

          <div>
            <p className="font-bold text-kat-blue mb-1">Cookies</p>
            <p className="text-kat-gray-dark leading-snug">We do not use cookies. Only localStorage is used, which stays on your device and is never transmitted to third parties.</p>
          </div>

          <div>
            <p className="font-bold text-kat-blue mb-1">Contact</p>
            <p className="text-kat-gray-dark leading-snug">Questions? Reach out via the KATegories GitHub page.</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 bg-kat-blue text-white font-bold rounded-xl hover:opacity-90 transition-opacity text-sm tracking-wide"
        >
          Close
        </button>
      </div>
    </div>
  );
}
