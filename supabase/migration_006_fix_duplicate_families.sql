-- ============================================================================
-- Migration 006: fix duplicate family records
-- Run in Supabase SQL Editor.
--
-- Root cause: the dashboard looked up a parent's family with .maybeSingle(),
-- which silently fails (returns nothing, no error surfaced) if more than
-- one row exists for the same owner. Every repeated "create family" attempt
-- during earlier testing/redeployments just added another duplicate row
-- instead of ever being caught, which is why this could resurface.
-- ============================================================================

-- STEP 0 — RUN THIS FIRST, ON ITS OWN, BEFORE ANYTHING ELSE BELOW.
-- This just looks, it doesn't change anything. Confirm which family_id
-- actually has children attached (that's your real one) before deleting
-- anything — this is the safety check.
--
--   select f.id, f.name, f.created_at, count(c.id) as num_children
--   from families f
--   left join child_profiles c on c.family_id = f.id
--   group by f.id, f.name, f.created_at
--   order by f.created_at;
--
-- You should see exactly ONE row with a real num_children count (George +
-- Louis) and the rest with 0. If that's what you see, it's safe to run
-- Steps 1 and 2 below. If more than one row has children attached, STOP
-- and send me a screenshot of the result instead of proceeding.

-- STEP 1: keep only the family row that actually has children attached
-- (falls back to the oldest row if, unexpectedly, none do).
delete from families
where id not in (
  select f.id from families f
  left join child_profiles c on c.family_id = f.id
  group by f.id
  order by count(c.id) desc, f.created_at asc
  limit 1
);

-- STEP 2: prevent this from ever silently happening again.
alter table families add constraint families_owner_unique unique (owner_user_id);
