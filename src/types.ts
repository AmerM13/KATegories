export interface CategoryPlayer {
  name: string;
  aliases: string[];
  percentage: number;
}

export interface Category {
  category: string;
  players: CategoryPlayer[];
  simulatedPercentiles: Record<number, number>;
}

export interface Guess {
  playerName: string;
  percentage: number;
}

export interface GameState {
  status: 'playing' | 'eliminated';
  guesses: Guess[];
  score: number;
  percentile?: number;
  wrongGuess?: string;
}
