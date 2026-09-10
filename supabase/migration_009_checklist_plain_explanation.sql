-- ============================================================================
-- Migration 009: full outcome text + plain-language explanation
-- Run in Supabase SQL Editor.
-- ============================================================================

alter table checklist_items add column if not exists plain_explanation text;
