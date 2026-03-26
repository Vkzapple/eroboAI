// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for browser (read-only, respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side writes (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
})

// ============================================================
// DATABASE SCHEMA — run this SQL in Supabase SQL Editor
// ============================================================
export const SCHEMA_SQL = `
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Research papers table
create table if not exists research_items (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  source          text not null,
  authors         text[],
  url             text not null unique,
  published_at    timestamptz not null,
  field           text not null,
  fields          text[],
  summary_ai      text,
  summary_original text,
  arxiv_id        text,
  relevance_score integer default 0,
  is_featured     boolean default false,
  created_at      timestamptz default now()
);

-- Research gaps table
create table if not exists research_gaps (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  field           text not null,
  related_fields  text[],
  reason          text not null,
  opportunity     text,
  difficulty      text default 'sedang',
  level           text default 'moderat',
  relevance_score integer default 0,
  tags            text[],
  source_papers   uuid[],
  generated_at    timestamptz default now(),
  created_at      timestamptz default now()
);

-- Research ideas table
create table if not exists research_ideas (
  id                uuid primary key default uuid_generate_v4(),
  title             text not null,
  gap_id            uuid references research_gaps(id),
  field             text not null,
  tags              text[],
  description       text not null,
  methodology       text,
  expected_outcome  text,
  difficulty        text default 'sedang',
  feasibility_score integer default 0,
  originality_score integer default 0,
  created_at        timestamptz default now()
);

-- Agent run logs
create table if not exists agent_logs (
  id              uuid primary key default uuid_generate_v4(),
  started_at      timestamptz default now(),
  finished_at     timestamptz,
  status          text default 'running',
  papers_fetched  integer default 0,
  gaps_found      integer default 0,
  ideas_generated integer default 0,
  error           text
);

-- Indexes for performance
create index if not exists idx_research_field on research_items(field);
create index if not exists idx_research_created on research_items(created_at desc);
create index if not exists idx_research_featured on research_items(is_featured);
create index if not exists idx_gaps_level on research_gaps(level);
create index if not exists idx_gaps_score on research_gaps(relevance_score desc);

-- Row Level Security (public read)
alter table research_items enable row level security;
alter table research_gaps enable row level security;
alter table research_ideas enable row level security;
alter table agent_logs enable row level security;

create policy "Public read research" on research_items for select using (true);
create policy "Public read gaps" on research_gaps for select using (true);
create policy "Public read ideas" on research_ideas for select using (true);
create policy "Public read logs" on agent_logs for select using (true);
`
