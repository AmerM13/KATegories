/**
 * Scrapes Basketball Reference to build a comprehensive list of all NBA players with years.
 * Run with: npm run update-players
 */

import * as cheerio from "cheerio";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, "../src/data/nbaPlayers.ts");

const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");
const BASE_URL = "https://www.basketball-reference.com/players";
const DELAY_MS = 3500;
const CURRENT_YEAR = 2026;

interface PlayerData {
  name: string;
  fromYear: number;
  toYear: number;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchPlayersForLetter(letter: string): Promise<PlayerData[]> {
  const url = `${BASE_URL}/${letter}/`;
  console.log(`Fetching ${url} ...`);

  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  ⚠ ${url} returned ${res.status}, skipping`);
    return [];
  }

  const html = await res.text();
  const $ = cheerio.load(html);
  const players: PlayerData[] = [];

  $("table#players tbody tr").each((_, row) => {
    const nameEl = $(row).find("th[data-stat='player'] a");
    let name = nameEl.text().trim().replace(/\*$/, "").trim();
    if (!name) return;

    const fromYear = parseInt($(row).find("td[data-stat='year_min']").text().trim()) || 0;
    const toYear = parseInt($(row).find("td[data-stat='year_max']").text().trim()) || 0;

    if (fromYear > 0 && toYear > 0) {
      players.push({ name, fromYear, toYear });
    }
  });

  console.log(`  Found ${players.length} players for letter "${letter}"`);
  return players;
}

async function main() {
  console.log("🏀 Scraping Basketball Reference for all NBA players with years...\n");

  const allPlayers: PlayerData[] = [];

  for (const letter of LETTERS) {
    const players = await fetchPlayersForLetter(letter);
    allPlayers.push(...players);
    if (letter !== LETTERS[LETTERS.length - 1]) {
      await sleep(DELAY_MS);
    }
  }

  // Deduplicate by name (keep highest toYear if dupes)
  const byName = new Map<string, PlayerData>();
  for (const p of allPlayers) {
    const existing = byName.get(p.name);
    if (!existing || p.toYear > existing.toYear) {
      byName.set(p.name, p);
    }
  }

  const unique = [...byName.values()];

  // Sort: by lastYear descending, then alphabetically
  unique.sort((a, b) => {
    if (b.toYear !== a.toYear) return b.toYear - a.toYear;
    return a.name.localeCompare(b.name, "en", { sensitivity: "base" });
  });

  console.log(`\n✅ Total unique players: ${unique.length}`);

  const lines = unique.map((p) => {
    const isPresent = p.toYear >= CURRENT_YEAR - 1;
    const yearsActive = isPresent ? `${p.fromYear}-Present` : `${p.fromYear}-${p.toYear}`;
    const lastYear = isPresent ? CURRENT_YEAR : p.toYear;
    return `  { name: ${JSON.stringify(p.name)}, yearsActive: ${JSON.stringify(yearsActive)}, lastYear: ${lastYear} },`;
  });

  const content = `export interface NbaPlayer {
  name: string;
  yearsActive: string;
  lastYear: number;
}

export const allNbaPlayers: NbaPlayer[] = [
${lines.join("\n")}
];
`;

  writeFileSync(OUTPUT_PATH, content, "utf-8");
  console.log(`📝 Written to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
