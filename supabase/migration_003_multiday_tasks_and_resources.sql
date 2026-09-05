-- ============================================================================
-- Migration 003: multi-day recurring tasks + richer checklist resources
-- Run in Supabase SQL Editor. Safe on an existing database.
-- ============================================================================

-- Tasks: replace single when_tag with an array of days, so one task can be
-- allocated to Tue+Wed+Thu (e.g. "spelling practice") in a single entry.
alter table tasks add column if not exists days text[] not null default '{}';
alter table tasks add column if not exists is_recurring boolean not null default false;

-- Backfill existing single-day tasks into the new array column.
update tasks set days = array[when_tag] where when_tag not in ('Week') and days = '{}';
-- 'Week' meant "flexible, no fixed day" — that's now just an empty days array.

-- Checklist items: each curriculum code now carries its own resources and
-- mark-off guidance directly, instead of that living only in a document.
alter table checklist_items add column if not exists khan_resource text;
alter table checklist_items add column if not exists twinkl_resource text;
alter table checklist_items add column if not exists other_ideas text;
alter table checklist_items add column if not exists markoff_criteria text;
alter table checklist_items add column if not exists is_ongoing boolean not null default false;
