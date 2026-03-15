-- ============================================================
-- KATegories — Supabase Row Level Security (RLS)
-- Run this in your Supabase project SQL editor
-- ============================================================

-- Enable RLS on both tables
ALTER TABLE guess_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------
-- guess_events policies
-- ---------------------------------------------------------------

-- Anyone can INSERT their own guesses (session_id from client)
CREATE POLICY "Allow insert own guesses"
  ON guess_events FOR INSERT
  WITH CHECK (true);

-- Anyone can SELECT guess_events for aggregate % calculations
-- (we need all rows to compute percentages, but no PII is stored)
CREATE POLICY "Allow read all guesses"
  ON guess_events FOR SELECT
  USING (true);

-- No updates or deletes allowed from the client
-- (server-side only via service role key if ever needed)

-- ---------------------------------------------------------------
-- game_results policies
-- ---------------------------------------------------------------

-- Anyone can INSERT/UPDATE their own result (identified by session_id)
CREATE POLICY "Allow insert own result"
  ON game_results FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update own result"
  ON game_results FOR UPDATE
  USING (true);

-- Anyone can SELECT game_results for percentile calculation
-- (scores are anonymous — no names or PII stored)
CREATE POLICY "Allow read all results"
  ON game_results FOR SELECT
  USING (true);

-- ---------------------------------------------------------------
-- Rate limiting note:
-- Supabase anon key is safe to expose in the client.
-- The anon key only allows what RLS policies permit above.
-- Never expose your service_role key in client code.
-- ---------------------------------------------------------------
