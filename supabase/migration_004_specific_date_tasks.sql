-- ============================================================================
-- Migration 004: specific-date task scheduling
-- Run in Supabase SQL Editor. Safe on an existing database.
-- ============================================================================

-- A task can now optionally be pinned to one exact calendar date (e.g. an
-- excursion on 15 September), instead of only ever repeating on a weekday
-- pattern. If specific_date is set, it takes priority over `days` for that
-- task — it shows up on that one date only, not every week.
alter table tasks add column if not exists specific_date date;
