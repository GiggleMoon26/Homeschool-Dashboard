-- ============================================================================
-- Migration 011: reading log amount/duration field
-- Run in Supabase SQL Editor.
-- ============================================================================

alter table reading_log add column if not exists amount_read text;
