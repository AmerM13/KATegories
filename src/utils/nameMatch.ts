import type { CategoryPlayer } from '../types';

function normalize(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .replace(/[.''\-]/g, '')          // strip punctuation
    .replace(/\s+/g, ' ')
    .trim();
}

export function findPlayer(
  input: string,
  players: CategoryPlayer[]
): CategoryPlayer | null {
  const normalizedInput = normalize(input);
  if (!normalizedInput) return null;

  for (const player of players) {
    const names = [player.name, ...player.aliases];
    for (const name of names) {
      if (normalize(name) === normalizedInput) {
        return player;
      }
    }
  }
  return null;
}
