-- =====================================================================
-- LANGKAH PULANG — Skema Cloud Save & Row Level Security (Supabase)
-- Jalankan file ini di Supabase SQL Editor untuk mengaktifkan Cloud Save.
-- =====================================================================

create extension if not exists "pgcrypto";

create table if not exists public.langkah_pulang_saves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  slot_id text not null check (char_length(slot_id) between 1 and 64),
  journal_name text not null check (char_length(journal_name) between 1 and 80),
  chapter smallint not null default 1 check (chapter in (1, 2, 3)),
  save_payload jsonb not null,
  unlocked_endings text[] not null default '{}',
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, slot_id)
);

create index if not exists idx_langkah_pulang_saves_user
  on public.langkah_pulang_saves (user_id, updated_at desc);

alter table public.langkah_pulang_saves enable row level security;

-- Hanya pemilik akun yang dapat membaca save miliknya
drop policy if exists "Users can view own saves" on public.langkah_pulang_saves;
create policy "Users can view own saves"
  on public.langkah_pulang_saves
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Hanya pemilik akun yang dapat membuat save miliknya
drop policy if exists "Users can insert own saves" on public.langkah_pulang_saves;
create policy "Users can insert own saves"
  on public.langkah_pulang_saves
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Hanya pemilik akun yang dapat memperbarui save miliknya
drop policy if exists "Users can update own saves" on public.langkah_pulang_saves;
create policy "Users can update own saves"
  on public.langkah_pulang_saves
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Hanya pemilik akun yang dapat menghapus save miliknya
drop policy if exists "Users can delete own saves" on public.langkah_pulang_saves;
create policy "Users can delete own saves"
  on public.langkah_pulang_saves
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Trigger otomatis memperbarui updated_at
create or replace function public.touch_langkah_pulang_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_langkah_pulang_updated_at on public.langkah_pulang_saves;
create trigger trg_langkah_pulang_updated_at
  before update on public.langkah_pulang_saves
  for each row
  execute function public.touch_langkah_pulang_updated_at();
