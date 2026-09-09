-- =========================================================
-- SQL Schéma pro Kirklendář (Supabase)
-- Vložte a spusťte v: Supabase Dashboard -> SQL Editor
-- =========================================================

-- 1. Vytvoření tabulky událostí
create table if not exists public.events (
  id text primary key,
  title text not null,
  start_date text not null,
  start_time text not null,
  duration text not null,
  location text default '',
  participants text[] default '{}',
  created_at bigint default (extract(epoch from now()) * 1000)::bigint
);

-- 2. Index pro rychlé řazení podle data
create index if not exists idx_events_start_date on public.events(start_date);

-- 3. Zapnutí Row Level Security (RLS)
alter table public.events enable row level security;

-- 4. Povolení operací pro anonymní uživatele (s vaším anon klíčem)
drop policy if exists "Povolit čtení akcí pro anon" on public.events;
create policy "Povolit čtení akcí pro anon" on public.events
  for select to anon, authenticated
  using (true);

drop policy if exists "Povolit přidávání akcí pro anon" on public.events;
create policy "Povolit přidávání akcí pro anon" on public.events
  for insert to anon, authenticated
  with check (true);

drop policy if exists "Povolit úpravu akcí pro anon" on public.events;
create policy "Povolit úpravu akcí pro anon" on public.events
  for update to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Povolit mazání akcí pro anon" on public.events;
create policy "Povolit mazání akcí pro anon" on public.events
  for delete to anon, authenticated
  using (true);

-- 5. Zapnutí Supabase Realtime (pro okamžitou synchronizaci mezi zařízeními)
alter publication supabase_realtime add table public.events;
