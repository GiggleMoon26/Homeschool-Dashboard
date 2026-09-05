-- ============================================================================
-- Homeschool Dashboard — Database Schema (fresh install)
-- If you already have tables from before, use migration_002 instead of this.
-- Run this once in your Supabase project's SQL Editor (Dashboard > SQL Editor > New query).
-- ============================================================================

create table families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table child_profiles (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  name text not null,
  year_level text,
  stage text,
  avatar text default '🎮',
  color text default '#05d9e8',
  username text not null unique,   -- what the child types in to log in
  pin_hash text not null,          -- bcrypt hash of their password, never store it raw
  created_at timestamptz not null default now()
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  child_id uuid not null references child_profiles(id) on delete cascade,
  subject text not null,
  description text not null,
  code text,
  markoff text,
  resource text,
  activity_type text,
  days text[] not null default '{}',   -- e.g. {Mon,Wed,Fri}; empty = flexible/no fixed day
  is_recurring boolean not null default false,
  done boolean not null default false,
  date_completed date,
  evidence text,
  notes text,
  created_at timestamptz not null default now()
);

create table checklist_items (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  child_id uuid not null references child_profiles(id) on delete cascade,
  code text not null,
  title text not null,
  subject text not null,
  khan_resource text,
  twinkl_resource text,
  other_ideas text,
  markoff_criteria text,
  is_ongoing boolean not null default false,
  done boolean not null default false,
  date_ticked date,
  created_at timestamptz not null default now()
);

create table worksheets (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  child_id uuid not null references child_profiles(id) on delete cascade,
  title text not null,
  subject text,
  code text,
  status text not null default 'assigned',
  submitted_date date,
  marked_date date,
  parent_feedback text,
  created_at timestamptz not null default now()
);

create table worksheet_questions (
  id uuid primary key default gen_random_uuid(),
  worksheet_id uuid not null references worksheets(id) on delete cascade,
  position int not null default 0,
  prompt text not null,
  guidance text,
  fixed_answer text,
  kid_answer text default '',
  mark text
);

create table spelling_lists (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  child_id uuid not null references child_profiles(id) on delete cascade,
  list_name text not null,
  words text[] not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table spelling_practice_history (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references child_profiles(id) on delete cascade,
  attempted_at timestamptz not null default now(),
  score int not null,
  total int not null
);

create table idea_items (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  child_id uuid not null references child_profiles(id) on delete cascade,
  list_type text not null,
  category text not null,
  item_text text not null,
  position int not null default 0
);

alter table families enable row level security;
alter table child_profiles enable row level security;
alter table tasks enable row level security;
alter table checklist_items enable row level security;
alter table worksheets enable row level security;
alter table worksheet_questions enable row level security;
alter table spelling_lists enable row level security;
alter table spelling_practice_history enable row level security;
alter table idea_items enable row level security;

create policy "Parents manage their own family" on families
  for all using (owner_user_id = auth.uid());

create policy "Parents manage their own children" on child_profiles
  for all using (family_id in (select id from families where owner_user_id = auth.uid()));

create policy "Parents manage their own tasks" on tasks
  for all using (family_id in (select id from families where owner_user_id = auth.uid()));

create policy "Parents manage their own checklist" on checklist_items
  for all using (family_id in (select id from families where owner_user_id = auth.uid()));

create policy "Parents manage their own worksheets" on worksheets
  for all using (family_id in (select id from families where owner_user_id = auth.uid()));

create policy "Parents manage their own worksheet questions" on worksheet_questions
  for all using (worksheet_id in (
    select id from worksheets where family_id in (select id from families where owner_user_id = auth.uid())
  ));

create policy "Parents manage their own spelling lists" on spelling_lists
  for all using (family_id in (select id from families where owner_user_id = auth.uid()));

create policy "Parents manage their own spelling history" on spelling_practice_history
  for all using (child_id in (
    select id from child_profiles where family_id in (select id from families where owner_user_id = auth.uid())
  ));

create policy "Parents manage their own idea items" on idea_items
  for all using (family_id in (select id from families where owner_user_id = auth.uid()));

-- NOTE: Children never connect directly with their own Postgres role — all
-- child-facing reads/writes go through Next.js API routes/Server Actions
-- using the service-role key, after verifying the child's signed session
-- cookie or (for edits/deletes) the parent's own RLS-respecting session.
