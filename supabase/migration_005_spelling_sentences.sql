-- ============================================================================
-- Migration 005: context sentences for spelling words (homophone fix)
-- Run in Supabase SQL Editor. Safe on an existing database.
-- ============================================================================

-- Parallel array to `words` — sentences[i] is the example sentence for
-- words[i]. Used to disambiguate homophones (sea/see, their/there) when the
-- word is spoken aloud, since audio alone can't tell them apart.
alter table spelling_lists add column if not exists sentences text[] not null default '{}';
