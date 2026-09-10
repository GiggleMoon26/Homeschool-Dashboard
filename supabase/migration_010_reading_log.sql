-- ============================================================================
-- Migration 010: reading log
-- Run in Supabase SQL Editor.
-- ============================================================================

-- Deliberately simple and not curriculum-linked — matches the standing rule
-- from early on that daily independent reading has no code and isn't tied
-- to a specific outcome, just a habit worth keeping a real record of.
create table reading_log (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  child_id uuid not null references child_profiles(id) on delete cascade,
  book_title text not null,
  author text,
  date_read date not null,
  notes text,
  created_at timestamptz not null default now()
);

alter table reading_log enable row level security;

create policy "Parents manage their own reading log" on reading_log
  for all using (family_id in (select id from families where owner_user_id = auth.uid()));
