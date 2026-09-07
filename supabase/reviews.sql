create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 60),
  course text not null check (char_length(course) between 2 and 80),
  text text not null check (char_length(text) between 5 and 600),
  rating integer not null default 5 check (rating between 1 and 5),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- Existing projects: add moderation column and publish old reviews
alter table public.reviews
  add column if not exists approved boolean not null default false;

update public.reviews
set approved = true
where approved is distinct from true;

-- Relax minimum review length (was 20)
alter table public.reviews drop constraint if exists reviews_text_check;
alter table public.reviews
  add constraint reviews_text_check check (char_length(text) between 5 and 600);

alter table public.reviews enable row level security;

drop policy if exists "Anyone can read reviews" on public.reviews;
create policy "Anyone can read approved reviews"
  on public.reviews
  for select
  using (approved = true);

drop policy if exists "Anyone can add reviews" on public.reviews;
drop policy if exists "Authenticated users can add reviews" on public.reviews;
create policy "Authenticated users can add reviews"
  on public.reviews
  for insert
  to authenticated
  with check (true);

-- В Supabase Table Editor: для нового отзыва поставьте approved = true, чтобы показать на сайте.
