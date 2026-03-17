interface HeaderProps {
  onShowRules: () => void;
}

export default function Header({ onShowRules }: HeaderProps) {
  return (
    <header className="border-b-2 border-kat-blue/20 mb-4">
      <div className="flex items-center justify-between py-3">
        <div className="w-9" />
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight select-none" style={{ fontFamily: 'Network, system-ui, sans-serif' }}>
          <span className="text-kat-orange">KAT</span>
          <span className="text-kat-blue">egories</span>
        </h1>
        <button
          onClick={onShowRules}
          className="w-9 h-9 rounded-full bg-kat-beige-dark text-kat-blue font-bold text-base hover:bg-kat-blue hover:text-white transition-colors flex items-center justify-center"
          aria-label="Show rules"
        >
          ?
        </button>
      </div>
    </header>
  );
}
