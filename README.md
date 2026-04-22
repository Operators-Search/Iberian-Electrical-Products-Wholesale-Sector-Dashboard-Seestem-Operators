# Iberian Electrical Products Wholesale Sector Dashboard

Public read-only sector dashboard built with Next.js, Tailwind CSS, Supabase Postgres, and a manual Excel import workflow.

## What is included

- `Overview` page with KPI cards, simple distribution charts, top-company rankings, and a sector bubble chart
- `Companies` page with search, filters, sorting, pagination, and a detail panel with historical charts
- `Ownership Groups` page grouped by repeated `Propietario` values
- Supabase SQL migration for the required schema and public read policies
- `scripts/import-data.ts` to read `Dashboard.xlsx` and `SABI.xlsx`, merge by `BvD Code`, and upsert into Supabase

## Tech stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Recharts
- Supabase Postgres
- Vercel-ready configuration

## Data rules implemented

- `BvD Code` is the unique company identifier
- `Dashboard.xlsx` defines sector membership and is the primary source for sector-ready metrics
- `SABI.xlsx` enriches company detail and historical financials for matching companies only
- In `Dashboard.xlsx`, columns after `WC/T/o` are treated as boolean attributes
- Boolean conversion:
  - `✓` => `true`
  - `⮽` or empty => `false`
- The importer ignores SABI-only companies that are not present in the Dashboard file

## Project structure

```text
app/
components/
data/input/
lib/
public/
scripts/
supabase/migrations/
types/
```

## Prerequisites

- Node.js 18.12+ or newer
- A package manager such as `pnpm`
- A Supabase project

## 1. Install dependencies

```bash
pnpm install
```

## 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Notes:

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is used by the Next.js app for public read queries
- `SUPABASE_SERVICE_ROLE_KEY` is only used by `scripts/import-data.ts`

## 3. Create the database schema in Supabase

Run the SQL in:

- `supabase/migrations/20260421173000_init_sector_dashboard.sql`

You can paste it into the Supabase SQL editor or apply it with the Supabase CLI if you already use it locally.

This migration creates:

- `companies`
- `company_attributes`
- `company_financial_history`
- indexes
- `updated_at` trigger
- RLS policies that allow public `select` access for `anon`

## 4. Put the Excel files in place

Preferred location:

- `data/input/Dashboard.xlsx`
- `data/input/SABI.xlsx`

The importer also supports the current fallback layout from the project root:

- `Dashboard.xlsx`
- `SABI.xlsx`

## 5. Import the data

```bash
pnpm import:data
```

What the script does:

1. Reads both Excel files
2. Validates the Dashboard column layout
3. Converts the 7 sector attributes to booleans
4. Normalizes SABI headers
5. Merges rows by `BvD Code`
6. Upserts `companies`
7. Rebuilds `company_attributes`
8. Rebuilds `company_financial_history`
9. Removes stale companies that are no longer in the current Dashboard file

## 6. Run locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## 7. Verification commands

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Deploy to Vercel

1. Push the repo to GitHub or upload it to Vercel
2. Create a new Vercel project
3. Add the environment variables from `.env.example`
4. Deploy

Recommended Vercel environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Do not expose `SUPABASE_SERVICE_ROLE_KEY` to the browser. Keep it only for import tasks or secure server-side jobs.

## Notes on metric formatting

- Currency values in the UI are displayed in EUR
- Monetary values from Dashboard and SABI are converted from `th EUR` to actual `EUR` during import
- Missing numeric values are rendered as `—`
- Overview uses median EBITDA %

## Security model

- The frontend is read-only
- No login or auth flow is included in v1
- Browser users never get write access to the database
- Public reads are controlled through RLS `select` policies on the three public tables

## Manual re-import workflow

When you receive updated Excel files:

1. Replace the files in `data/input/` or the project root
2. Run `pnpm import:data`
3. Redeploy if needed

## Useful commands

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm import:data
```
