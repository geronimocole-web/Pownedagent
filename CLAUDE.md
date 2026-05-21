# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

PowNed Redactie Agent — AI-gestuurde nieuwsselectie voor de PowNed redactie. Scrapet RSS-feeds elke dag op 08:30, 13:00 en 17:00, scoort elk nieuwsitem op het "PowNed DNA" (brutaal / spraakmakend / absurd / lokaal) via de Anthropic API, en genereert automatisch een volledige redactie-insteek. Alles is zichtbaar in een Next.js dashboard.

## Monorepo structuur (pnpm workspaces)

```
packages/
  database/     — Supabase client + TypeScript types voor alle tabellen + queries
  scraper/      — RSS/sitemap fetcher + node-cron scheduler
  dna-filter/   — Anthropic SDK scoring engine + insteek-generator
  dashboard/    — Next.js 14 (App Router) redactie-UI
```

De packages importeren elkaar als `@powned/database`, `@powned/scraper`, etc.

## Veelgebruikte commando's

```bash
# Alles installeren
pnpm install

# Alles tegelijk draaien (dashboard + scraper watcher)
pnpm dev

# Alleen dashboard (localhost:3000)
pnpm --filter dashboard dev

# Scraper één keer handmatig starten
pnpm --filter scraper start

# Alle niet-gescoorde items scoren via CLI
pnpm --filter dna-filter score

# Alle tests draaien
pnpm test

# Tests van één package
pnpm --filter scraper test
pnpm --filter dna-filter test
pnpm --filter dashboard test

# Eén testbestand direct
cd packages/scraper && pnpm vitest run src/__tests__/rss.test.ts
```

## Environment variabelen

Kopieer `.env.example` naar `.env` en vul in:

| Variabele | Gebruik |
|---|---|
| `OPENAI_API_KEY` | Scoring + insteek-generatie (gpt-4o) |
| `SUPABASE_URL` | Database verbinding |
| `SUPABASE_ANON_KEY` | Public reads |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side writes (scraper, API routes) |
| `CRON_SECRET` | Bearer token voor `POST /api/scrape` |

## Database setup

Voer in Supabase SQL Editor uit (in volgorde):
1. `packages/database/schema.sql` — tabellen, views, RLS policies
2. `packages/database/seed.sql` — 9 RSS-bronnen

De `feed_items` view joint `news_items` met `dna_scores` en sorteert op `total_score desc`.

## Architecturale beslissingen

**DNA score formule** (in `packages/dna-filter/src/scorer.ts`):
`total_score = brutaal×0.25 + spraakmakend×0.30 + absurd×0.20 + lokaal×0.25`

**OpenAI model**: altijd `gpt-4o` voor zowel scoring als insteek-generatie. De system prompts staan in `packages/dna-filter/src/powned-dna.ts` (`POWNED_DNA_PROMPT` en `INSTEEK_PROMPT`). Pas hier aan als het DNA-profiel moet veranderen.

**API auth**: `POST /api/scrape` vereist `Authorization: Bearer <CRON_SECRET>`. Vercel roept dit endpoint aan via cron (zie `vercel.json`). Het dashboard zelf gebruikt HTTP Basic Auth via `packages/dashboard/middleware.ts` (tijdelijk hardcoded: `powned` / `redactie2025`).

**Dubbele items**: de `news_items.url` kolom heeft een `UNIQUE` constraint. De scraper gebruikt `upsert` met `ignoreDuplicates: true`, waardoor herstarten altijd veilig is.

**Insteek-generatie**: gebeurt lazy — alleen als de redacteur erop klikt. De insteek wordt opgeslagen in `dna_scores.insteek` (jsonb). Structuur van het insteek-object staat als TypeScript interface `Insteek` in `packages/database/client.ts`.

## Nieuwe RSS-bron toevoegen

Voeg een rij in `packages/database/seed.sql` toe en voer opnieuw uit, of voeg direct toe via Supabase:
```sql
insert into sources (name, url, type) values ('Naam', 'https://...', 'rss');
```
De scraper pikt dit automatisch op bij de volgende run.

## Deployment

- Dashboard → Vercel (`vercel.json` in root, cron jobs op 06:30/11:00/15:00 UTC)
- Scraper standalone → Docker (`packages/scraper/Dockerfile`)
- CI/CD → `.github/workflows/deploy.yml` (test → preview bij PR, productie bij merge naar main)

Benodigde GitHub Secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_URL`.
