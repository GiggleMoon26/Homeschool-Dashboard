-- ============================================================================
-- Migration 008: parent to-do list
-- Run in Supabase SQL Editor.
-- ============================================================================

-- Family-level, not tied to a specific child — for the parent's own prep
-- tasks (print worksheets, buy supplies, book an excursion, etc.), matching
-- the "Master Prep Checklist" that used to only exist in the paper packs.
create table parent_todos (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  title text not null,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

alter table parent_todos enable row level security;

create policy "Parents manage their own to-dos" on parent_todos
  for all using (family_id in (select id from families where owner_user_id = auth.uid()));
