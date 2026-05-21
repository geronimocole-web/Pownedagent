# PowNed Redactie Agent 🎯

AI-gestuurde nieuwsselectie en insteek-generator voor de PowNed redactie.  
Scrapet RSS-feeds, scoort items op PowNed DNA en genereert automatisch een redactionele insteek.

---

## Architectuur

```
powned-agent/
├── packages/
│   ├── scraper/        # RSS + sitemap scraper (Node.js + node-cron)
│   ├── dna-filter/     # AI scoring engine (Anthropic SDK)
│   ├── database/       # Supabase client + schema
│   └── dashboard/      # Next.js 14 redactie-dashboard
```

---

## Snel starten (lokaal)

### 1. Vereisten

- Node.js 20+
- pnpm 9+
- Supabase account (gratis tier werkt)
- Anthropic API key

### 2. Installeren

```bash
git clone <repo-url>
cd powned-agent
pnpm install
```

### 3. Environment variabelen

```bash
cp .env.example .env
# Vul in: ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY, CRON_SECRET
```

### 4. Database opzetten

1. Maak een nieuw Supabase project aan op [supabase.com](https://supabase.com)
2. Ga naar **SQL Editor** en voer uit:
   ```sql
   -- Eerst het schema
   \i packages/database/schema.sql
   -- Dan de seed data
   \i packages/database/seed.sql
   ```
3. Kopieer de **Project URL** en **anon key** naar je `.env`

### 5. Lokaal draaien

```bash
# Alles tegelijk (dashboard + scraper)
pnpm dev

# Alleen dashboard
pnpm --filter dashboard dev

# Scraper handmatig draaien
pnpm --filter scraper start

# Alle items scoren
pnpm --filter dna-filter score
```

Het dashboard is bereikbaar op [http://localhost:3000](http://localhost:3000)  
Login: `powned` / `redactie2025`

---

## Deployment (Vercel)

### 1. Vercel CLI installen

```bash
npm install -g vercel
vercel login
```

### 2. Project deployen

```bash
cd packages/dashboard
vercel --prod
```

### 3. Environment variabelen instellen in Vercel

Ga naar **Project Settings → Environment Variables** en voeg toe:
- `ANTHROPIC_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET` (kies een willekeurig sterk wachtwoord)

### 4. Cron jobs

De `vercel.json` configureert automatisch cron jobs voor:
- `08:30` — ochtend scrape
- `13:00` — middag scrape  
- `17:00` — avond scrape

---

## Kosten (schatting per maand)

| Component | Kosten |
|---|---|
| Anthropic API (~500 items/dag × 30) | ~€8-15 |
| Supabase (Free tier) | €0 |
| Vercel (Free tier) | €0 |
| **Totaal** | **~€8-15/maand** |

---

## PowNed DNA Score

Elk nieuwsitem wordt gescoord op 4 dimensies:

| Dimensie | Gewicht | Omschrijving |
|---|---|---|
| 🔥 Brutaal | 25% | Direct, confronterend, ongefilterd |
| 📢 Spraakmakend | 30% | Viraal, deelbaar, discussie-uitlokkend |
| 🌀 Absurd | 20% | Bizar, onverwacht, komisch-tragisch |
| 📍 Lokaal | 25% | Lokaal verhaal met nationaal potentieel |

Items met een totaalscore ≥ 7.0 worden als **sterk PowNed-waardig** beschouwd.
