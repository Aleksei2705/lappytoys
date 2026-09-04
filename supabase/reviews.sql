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

drop policy if exists "Anyone can read reviews" on public.reviews;
create policy "Anyone can read reviews"
  on public.reviews
  for select
  using (true);

-- Старая политика открытой записи (если есть) — удалить:
drop policy if exists "Anyone can add reviews" on public.reviews;

drop policy if exists "Authenticated users can add reviews" on public.reviews;
create policy "Authenticated users can add reviews"
  on public.reviews
  for insert
  to authenticated
  with check (true);

-- ---------------------------------------------------------------------------
-- Email notification on new review (server-side, does not depend on browser)
-- 1) Dashboard → Database → Extensions → enable "pg_net"
-- 2) Run this block in SQL Editor
-- ---------------------------------------------------------------------------

create extension if not exists pg_net with schema extensions;

create or replace function public.notify_review_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  notify_url text := 'https://formsubmit.co/ajax/olgalapteva8518@gmail.com';
begin
  perform net.http_post(
    url := notify_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Accept', 'application/json'
    ),
    body := jsonb_build_object(
      '_subject', 'Новый отзыв на lappytoys.kz — ' || NEW.name,
      '_template', 'table',
      '_captcha', 'false',
      'Имя', NEW.name,
      'Курс', NEW.course,
      'Оценка', NEW.rating::text || '/5',
      'Отзыв', NEW.text
    )
  );
  return NEW;
end;
$$;

drop trigger if exists on_review_insert_notify on public.reviews;
create trigger on_review_insert_notify
  after insert on public.reviews
  for each row
  execute function public.notify_review_email();
