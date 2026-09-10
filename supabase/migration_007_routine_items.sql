-- ============================================================================
-- Migration 007: morning routine & daily chores
-- Run in Supabase SQL Editor.
-- ============================================================================

-- Separate from `tasks` on purpose: chores/routine items reset every day
-- rather than being ticked off once and staying done forever. We track that
-- with a simple `last_completed_date` — checked today if it equals today's
-- date, and it naturally "resets" tomorrow with no cleanup job needed.
create table routine_items (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  child_id uuid not null references child_profiles(id) on delete cascade,
  title text not null,
  category text not null default 'morning',  -- 'morning' | 'chore'
  position int not null default 0,
  last_completed_date date,
  created_at timestamptz not null default now()
);

alter table routine_items enable row level security;

create policy "Parents manage their own routine items" on routine_items
  for all using (family_id in (select id from families where owner_user_id = auth.uid()));
