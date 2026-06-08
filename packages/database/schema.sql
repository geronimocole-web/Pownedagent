-- PowNed Redactie Agent — Database Schema
-- Voer uit in Supabase SQL Editor

-- UUID extensie
create extension if not exists "pgcrypto";

-- ============================================================
-- Bronnen (RSS feeds, sitemaps, etc.)
-- ============================================================
create table if not exists sources (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  url         text not null unique,
  type        text not null check (type in ('rss', 'sitemap', 'reddit')),
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- Nieuwsitems (raw, uit scraper)
-- ============================================================
create table if not exists news_items (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  url           text not null unique,
  source        text,
  platform      text check (platform in ('nieuws', 'twitter', 'reddit', 'overig')),
  published_at  timestamptz,
  raw_content   text,
  image_url     text,
  created_at    timestamptz not null default now()
);

create index if not exists news_items_created_at_idx on news_items(created_at desc);
create index if not exists news_items_platform_idx   on news_items(platform);

-- ============================================================
-- DNA Scores (AI scoring resultaten)
-- ============================================================
create table if not exists dna_scores (
  id            uuid primary key default gen_random_uuid(),
  news_item_id  uuid not null references news_items(id) on delete cascade,
  brutaal       numeric(4,1) not null check (brutaal between 0 and 10),
  spraakmakend  numeric(4,1) not null check (spraakmakend between 0 and 10),
  absurd        numeric(4,1) not null check (absurd between 0 and 10),
  lokaal        numeric(4,1) not null check (lokaal between 0 and 10),
  total_score   numeric(4,1) not null check (total_score between 0 and 10),
  reden         text,
  insteek       jsonb,
  scored_at     timestamptz not null default now()
);

create index if not exists dna_scores_item_idx        on dna_scores(news_item_id);
create index if not exists dna_scores_total_score_idx on dna_scores(total_score desc);

-- ============================================================
-- Handige views
-- ============================================================

-- Feed view: items met scores, gesorteerd op score
-- security_invoker=true: RLS policies worden gerespecteerd (voorkomt Security Advisor waarschuwing)
create or replace view feed_items
with (security_invoker = true) as
select
  ni.id,
  ni.title,
  ni.url,
  ni.source,
  ni.platform,
  ni.published_at,
  ni.image_url,
  ni.created_at,
  ds.brutaal,
  ds.spraakmakend,
  ds.absurd,
  ds.lokaal,
  ds.total_score,
  ds.reden,
  ds.insteek,
  ds.scored_at
from news_items ni
left join dna_scores ds on ds.news_item_id = ni.id
order by ds.total_score desc nulls last, ni.created_at desc;

-- ============================================================
-- Row Level Security (optioneel, voor productie)
-- ============================================================
alter table sources    enable row level security;
alter table news_items enable row level security;
alter table dna_scores enable row level security;

-- Service role heeft volledige toegang (voor de scraper/API)
create policy "service_role_all" on sources    for all using (true);
create policy "service_role_all" on news_items for all using (true);
create policy "service_role_all" on dna_scores for all using (true);
