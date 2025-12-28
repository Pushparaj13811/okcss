-- Migration: create presets table for okcss cloud preset storage.
--
-- Run this in your Supabase SQL editor or via supabase CLI:
--   supabase db push
--
-- Architecture note:
--   This app uses NextAuth (not Supabase Auth) for authentication.
--   Supabase RLS policies rely on auth.email() which is only populated
--   when a user has a Supabase Auth JWT — not a NextAuth session.
--
--   Ownership is therefore enforced at the API layer:
--     • Every query filters by .eq('user_email', email) where email
--       comes from a verified NextAuth session.
--     • RLS is disabled — the table is only accessible via server-side
--       API routes that require an active NextAuth session.

create table if not exists presets (
  id         uuid        primary key default gen_random_uuid(),
  user_email text        not null,
  tool       text        not null,
  name       text        not null check (char_length(name) > 0 and char_length(name) <= 60),
  state      jsonb       not null,
  is_public  boolean     not null default false,
  created_at timestamptz not null default now()
);

-- Efficient lookup: all presets for a user, optionally filtered by tool
create index if not exists presets_user_email_tool on presets(user_email, tool);

-- Efficient lookup: public presets gallery
create index if not exists presets_is_public on presets(is_public, tool, created_at desc)
  where is_public = true;

-- RLS is intentionally disabled. Security is enforced at the API layer via
-- NextAuth session checks and .eq('user_email', email) query filters.
alter table presets disable row level security;
