# KATegories — Dev Log

## What Is This
A daily NBA trivia game inspired by Wordle/Poeltl/Immaculate Grid.
- A new NBA category is revealed each day
- Players guess as many matching players as possible
- One wrong guess ends the game
- Rarer players (fewer people guess them) score MORE points
- Scores update live throughout the day as more people play
- Next day: a modal shows your finalized score from yesterday

## Tech Stack
- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Supabase (backend for tracking guesses + scores)
- Google Sheets (daily category source)
- Hosted on Vercel
- Repo: https://github.com/AmerM13/KATegories.git

---

## Project Structure

```
src/
  App.tsx                        # Root component, wires everything together
  types.ts                       # CategoryPlayer, Category, Guess, GameState
  index.css                      # Tailwind + custom fonts + animations

  components/
    Header.tsx                   # Title + ? help button
    CategoryBanner.tsx           # Blue banner showing today's KATegory
    ScoreDisplay.tsx             # Two tiles: Score (blue) + Correct (orange)
    GuessInput.tsx               # Search input + player dropdown
    GuessList.tsx                # List of correct guesses with live %
    GuessRow.tsx                 # Single guess row (name + live %)
    GameOverScreen.tsx           # Shown after wrong guess (score, percentile, message)
    RulesModal.tsx               # How to play modal (shown on first visit)
    YesterdayModal.tsx           # Shows finalized score from previous day on login
    ui/shine-border.tsx          # Animated shine border around the game card

  hooks/
    useGame.ts                   # Core game logic (guesses, liveScore, livePercentile)
    usePercentages.ts            # Supabase: live %, save results, fetch percentile
    useSheetCategory.ts          # Fetches today's category from Google Sheets CSV
    useLocalStorage.ts           # Generic localStorage hook

  data/
    categories.ts                # Fallback category data (used if Sheets not configured)
    nbaPlayers.ts                # 5,353 NBA players with yearsActive + lastYear (scraped)

  lib/
    supabase.ts                  # Supabase client (reads VITE_SUPABASE_URL + ANON_KEY)
    utils.ts                     # cn() helper for Tailwind class merging

  utils/
    dateUtils.ts                 # getTodayKey(), getTodaysCategoryIndex()
    nameMatch.ts                 # Fuzzy player name matching (aliases supported)

scripts/
  updatePlayers.ts               # Run with `npm run update-players` to re-scrape Basketball Reference

public/
  Network.ttf                    # Display font used for title (KATegories)
  Studio.ttf / Studio-Italic.ttf # Alternate title font
```

---

## Fonts
- **Title (KATegories heading)**: `Network.ttf` — bold retro-sports look
- **Body**: System sans-serif stack via Tailwind

---

## Color Scheme (Tailwind tokens in index.css)
| Token | Hex | Used for |
|-------|-----|----------|
| `kat-blue` | `#1e3a5f` | Header, category banner, score tile, game over header |
| `kat-orange` | `#f97316` | Correct tile, percentages, accents |
| `kat-black` | `#0f172a` | Body text |
| `kat-white` | `#ffffff` | Backgrounds |
| `kat-gray` | `#f1f5f9` | Subtle backgrounds |
| `kat-gray-dark` | `#64748b` | Secondary text |

---

## Scoring System
**Rarity scoring**: `score per player = 100 − (% of today's players who guessed them)`
- Dwight Howard guessed by 72% → **28 points**
- Randolph Keys guessed by 4% → **96 points**
- Rewards deep NBA knowledge over guessing obvious players
- Score is a live sum — updates throughout the day as more people play

---

## Supabase Setup
Two tables required. Run in Supabase SQL editor:

```sql
-- Tracks individual correct guesses per session per day
create table if not exists guess_events (
  id bigserial primary key,
  game_date date not null,
  player_name text not null,
  session_id text not null,
  created_at timestamptz default now(),
  unique (game_date, player_name, session_id)
);

-- Tracks final game results per session per day
create table if not exists game_results (
  id bigserial primary key,
  game_date date not null,
  session_id text not null,
  score numeric not null,
  correct_guesses integer not null,
  created_at timestamptz default now(),
  unique (game_date, session_id)
);
```

### Environment Variables
Add to `.env` (locally) and Vercel project settings:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SHEETS_CSV_URL=your-google-sheets-csv-url
```

---

## Google Sheets Category Format
Publish sheet as CSV (File → Share → Publish to web → CSV).
Set the URL as `VITE_SHEETS_CSV_URL`.

| Column | Format | Example |
|--------|--------|---------|
| date | YYYY-MM-DD | 2026-03-16 |
| category | Plain text | Players who played for both the Lakers AND Hornets |
| players | Pipe-separated names | Dwight Howard\|Glen Rice\|Eddie Jones |
| percentages | Pipe-separated numbers | 72\|48\|42 |

If no sheet is configured, the app falls back to `src/data/categories.ts`.

---

## Player Data
- 5,353 NBA players scraped from Basketball Reference
- Stored in `src/data/nbaPlayers.ts` as `NbaPlayer[]`
- Each has: `name`, `yearsActive` (e.g. "1996-Present"), `lastYear` (number)
- Sorted by `lastYear` descending, then alphabetically
- Re-scrape anytime: `npm run update-players`

---

## Daily Category Flow
1. App loads → `useSheetCategory` fetches Google Sheets CSV
2. Finds row matching today's date
3. Parses players + percentages
4. Falls back to `categories.ts[0]` if fetch fails or no matching row

---

## Yesterday Score Flow
1. On app load, check localStorage for yesterday's game key (`kategories-YYYY-MM-DD`)
2. If found with guesses, fetch yesterday's final Supabase percentages
3. Compute finalized score from those percentages
4. Show `YesterdayModal` once per day (flagged in localStorage after dismiss)

---

## localStorage Keys
| Key | Purpose |
|-----|---------|
| `kategories-YYYY-MM-DD` | Game state for that day (guesses, status, score) |
| `kategories-session-id` | Persistent anonymous session UUID |
| `kategories-rules-seen` | Whether rules modal has been shown |
| `kategories-yesterday-shown-YYYY-MM-DD` | Whether yesterday modal has been shown today |
| `kategories-sheet-YYYY-MM-DD` | Cached category data from Google Sheets |

---

## Known Pending Items
- Help button (?) is not wired up — needs `onShowRules` handler connected in Header
- Supabase + Google Sheets env vars need to be added to Vercel project settings
- `simulatedPercentiles` in `categories.ts` and `useSheetCategory.ts` will be replaced automatically once real `game_results` data accumulates in Supabase
- The large bundle warning (566 kB) is due to `nbaPlayers.ts` — can be lazy-loaded later

---

## Deployment
- Platform: Vercel
- Repo: https://github.com/AmerM13/KATegories.git
- Branch: `main`
- Build command: `npm run build`
- Output dir: `dist`
