import { useState, useRef, useEffect, useCallback } from 'react';
import { allNbaPlayers, type NbaPlayer } from '../data/nbaPlayers';

interface GuessInputProps {
  onSubmit: (guess: string) => void;
  disabled: boolean;
  message?: string | null;
}

export default function GuessInput({ onSubmit, disabled, message }: GuessInputProps) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<NbaPlayer[]>([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  const updateSuggestions = useCallback((query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    const lower = query.toLowerCase();
    const matches = allNbaPlayers.filter((p) =>
      p.name.toLowerCase().includes(lower)
    );
    setSuggestions(matches);
    setIsOpen(matches.length > 0);
    setHighlightIndex(-1);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    updateSuggestions(val);
  };

  const selectPlayer = (player: NbaPlayer) => {
    onSubmit(player.name);
    setValue('');
    setSuggestions([]);
    setIsOpen(false);
    setHighlightIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex >= 0) {
        selectPlayer(suggestions[highlightIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightIndex]);

  return (
    <div className="mt-3 relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          onFocus={() => { if (suggestions.length > 0) setIsOpen(true); }}
          disabled={disabled}
          placeholder={disabled ? "Game over" : "Type a player name..."}
          className="w-full px-5 py-4 rounded-xl border-2 border-kat-blue/30 bg-white/90 focus:border-kat-blue focus:outline-none text-lg transition-colors disabled:bg-kat-beige disabled:text-gray-400 shadow-sm font-medium"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
        />

        {isOpen && suggestions.length > 0 && (
          <ul
            ref={listRef}
            className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto"
            role="listbox"
          >
            {suggestions.map((player, i) => (
              <li
                key={player.name}
                role="option"
                aria-selected={i === highlightIndex}
                className={`px-4 py-3 cursor-pointer text-left transition-colors ${
                  i === highlightIndex
                    ? 'bg-kat-blue text-white'
                    : 'hover:bg-kat-gray text-kat-black'
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectPlayer(player);
                }}
                onMouseEnter={() => setHighlightIndex(i)}
              >
                <span className="font-medium">{player.name}</span>
                <span className={`ml-2 text-sm ${i === highlightIndex ? 'text-blue-200' : 'text-kat-gray-dark'}`}>
                  ({player.yearsActive})
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {message && (
        <p className="text-sm text-kat-gray-dark mt-2 animate-fade-in">{message}</p>
      )}
    </div>
  );
}
