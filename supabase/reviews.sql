create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 60),
  course text not null check (char_length(course) between 2 and 80),
  text text not null check (char_length(text) between 20 and 600),
  rating integer not null default 5 check (rating between 1 and 5),
  created_at timestamptz not null default now()
);

-- Если таблица уже создана без rating — выполните отдельно:
-- alter table public.reviews
--   add column if not exists rating integer not null default 5
--   check (rating between 1 and 5);

alter table public.reviews enable row level security;

create policy "Anyone can read reviews"
  on public.reviews
  for select
  using (true);

-- Старая политика открытой записи (если есть) — удалить:
-- drop policy if exists "Anyone can add reviews" on public.reviews;

create policy "Authenticated users can add reviews"
  on public.reviews
  for insert
  to authenticated
  with check (true);
