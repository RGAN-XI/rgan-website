-- Allows an article author to list more than one institution and department.
-- Affiliations live in a child table ("author_affiliations"), so one author
-- can have many affiliations.
--
-- SAFE TO PASTE INTO THE SUPABASE SQL EDITOR: this script is non-destructive.
-- It does not drop or delete any column, row or table, and it can be run more
-- than once without duplicating data.
-- Run it BEFORE deploying the matching application code.

begin;

-- 1. New table -------------------------------------------------------------
create table if not exists public.author_affiliations (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  author_id uuid not null,
  school text not null,
  department text null,
  city text null,
  country text null,
  position integer not null default 0,
  constraint author_affiliations_pkey primary key (id),
  constraint author_affiliations_author_id_fkey
    foreign key (author_id) references public.authors (id)
    on update cascade on delete cascade
) tablespace pg_default;

comment on table public.author_affiliations is
  'Institutions and departments of an article author. An author can have many; position keeps the display order (0 is the primary affiliation).';

create index if not exists author_affiliations_author_id_idx
  on public.author_affiliations (author_id);

-- 2. Copy existing data ------------------------------------------------------
-- Every existing author's current school, department, city and country is
-- copied across as their first affiliation (position 0). Authors that already
-- have an affiliation row are skipped, so re-running does nothing.
insert into public.author_affiliations
  (author_id, school, department, city, country, position)
select a.id, a.school, a.department, a.city, a.country, 0
from public.authors a
where a.school is not null
  and not exists (
    select 1
    from public.author_affiliations aa
    where aa.author_id = a.id
  );

-- 3. Keep the old columns, but stop requiring them --------------------------
-- The app now writes affiliations to author_affiliations, so new authors no
-- longer send a "school" value. The old columns stay in place (and keep their
-- data) as a backup; only the NOT NULL rule on "school" is relaxed.
alter table public.authors
  alter column school drop not null;

-- 4. Row level security -------------------------------------------------------
alter table public.author_affiliations enable row level security;

drop policy if exists "Author affiliations are viewable by everyone"
  on public.author_affiliations;
create policy "Author affiliations are viewable by everyone"
  on public.author_affiliations
  for select
  using (true);

drop policy if exists "Authenticated users can manage author affiliations"
  on public.author_affiliations;
create policy "Authenticated users can manage author affiliations"
  on public.author_affiliations
  for all
  to authenticated
  using (true)
  with check (true);

commit;

-- OPTIONAL CLEANUP (do NOT run until you have checked that every author shows
-- the right institutions on the website and in the admin dashboard):
--
-- alter table public.authors
--   drop column if exists school,
--   drop column if exists department,
--   drop column if exists city,
--   drop column if exists country;
