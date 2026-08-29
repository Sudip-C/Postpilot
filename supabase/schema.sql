-- PostPilot Supabase schema
-- Run this in the Supabase SQL Editor for a fresh project.

create extension if not exists pgcrypto;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  pillar_id text,
  post_type_id text,
  content text not null,
  status text not null default 'draft'
    check (status in ('draft', 'approved', 'published', 'failed')),
  linkedin_post_id text,
  error_message text,
  created_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists posts_created_at_idx
  on public.posts (created_at desc);

create index if not exists posts_status_idx
  on public.posts (status);

create table if not exists public.linkedin_tokens (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'linkedin' unique,
  encrypted_access_token text not null,
  access_token_iv text not null,
  access_token_auth_tag text not null,
  expires_at timestamptz,
  encrypted_refresh_token text,
  refresh_token_iv text,
  refresh_token_auth_tag text,
  refresh_token_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- PostPilot uses a backend-only Supabase secret key.
-- RLS is enabled deliberately and no public/browser policies are created here.
alter table public.posts enable row level security;
alter table public.linkedin_tokens enable row level security;

comment on table public.posts is
  'Generated LinkedIn posts and publication state for PostPilot.';

comment on table public.linkedin_tokens is
  'Encrypted LinkedIn OAuth token material. Never store plaintext access tokens.';
