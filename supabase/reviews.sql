create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 60),
  course text not null check (char_length(course) between 2 and 80),
  text text not null check (char_length(text) between 20 and 600),
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

create policy "Anyone can read reviews"
  on public.reviews
  for select
  using (true);

create policy "Anyone can add reviews"
  on public.reviews
  for insert
  with check (true);
