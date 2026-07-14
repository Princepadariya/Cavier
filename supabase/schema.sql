-- ============================================================================
-- Cavier — Supabase schema
-- Paste this whole file into: Supabase Dashboard → SQL Editor → New query → Run
-- Safe to re-run (uses IF NOT EXISTS / CREATE OR REPLACE / DROP POLICY IF EXISTS).
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helper: auto-update updated_at
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- CATEGORIES
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text not null unique,
  description  text default '',
  -- Full-bleed banner shown on the category page hero.
  hero_image   text,
  -- Square/portrait image used for the home-page category card.
  card_image   text,
  -- Whether this category renders a product row on the home page.
  show_on_home boolean not null default false,
  home_order   integer not null default 0,   -- order among home rows
  sort_order   integer not null default 0,   -- order in listings
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

drop trigger if exists trg_categories_updated on public.categories;
create trigger trg_categories_updated before update on public.categories
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- PRODUCTS
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  code          text default '',                 -- e.g. "FR 09-202"
  category_id   uuid references public.categories(id) on delete set null,
  price         numeric(12,2) not null default 0,
  short_desc    text default '',                 -- one-liner for cards/detail
  description   text default '',                 -- long description
  main_image    text,                            -- primary image
  gallery       jsonb not null default '[]'::jsonb, -- array of image URLs (thumbnails)
  -- finishes: [{ "name": "Chrome", "color": "#E8E8E8", "filter": "..." }]
  finishes      jsonb not null default '[]'::jsonb,
  -- features: ["10 Years Warranty", "Dynamic Color Options", ...]
  features      jsonb not null default '[]'::jsonb,
  -- specifications: [{ "label": "Flow rate", "value": "13.5 LPM" }]
  specifications jsonb not null default '[]'::jsonb,
  rating        integer not null default 5,
  is_active     boolean not null default true,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_active   on public.products(is_active);

drop trigger if exists trg_products_updated on public.products;
create trigger trg_products_updated before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- BLOGS
-- Content is stored as an ordered array of blocks so the admin can compose
-- freely:  [{ "type": "heading", "text": "..." },
--           { "type": "paragraph", "text": "..." },
--           { "type": "image", "url": "..." }]
-- ---------------------------------------------------------------------------
create table if not exists public.blogs (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text not null unique,
  author        text default 'By Cavier India',
  read_time     text default '4 min read',
  header_image  text,
  excerpt       text default '',                 -- intro / card summary
  content       jsonb not null default '[]'::jsonb,
  is_published  boolean not null default true,
  published_at  timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_blogs_published on public.blogs(is_published);

drop trigger if exists trg_blogs_updated on public.blogs;
create trigger trg_blogs_updated before update on public.blogs
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- CONTACT SUBMISSIONS
-- ---------------------------------------------------------------------------
create table if not exists public.contact_submissions (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text not null,
  contact      text default '',
  designation  text default '',
  subject      text default '',
  message      text not null,
  is_read      boolean not null default false,
  created_at   timestamptz not null default now()
);

create index if not exists idx_contact_created on public.contact_submissions(created_at desc);

-- ============================================================================
-- ROW LEVEL SECURITY
-- Public (anon) users: read active content + submit contact form.
-- Authenticated users (your admins): full read/write on everything.
-- ============================================================================
alter table public.categories          enable row level security;
alter table public.products            enable row level security;
alter table public.blogs               enable row level security;
alter table public.contact_submissions enable row level security;

-- ---- CATEGORIES -----------------------------------------------------------
drop policy if exists "categories public read"  on public.categories;
create policy "categories public read" on public.categories
  for select using (true);

drop policy if exists "categories admin write" on public.categories;
create policy "categories admin write" on public.categories
  for all to authenticated using (true) with check (true);

-- ---- PRODUCTS -------------------------------------------------------------
drop policy if exists "products public read"  on public.products;
create policy "products public read" on public.products
  for select using (true);

drop policy if exists "products admin write" on public.products;
create policy "products admin write" on public.products
  for all to authenticated using (true) with check (true);

-- ---- BLOGS ----------------------------------------------------------------
drop policy if exists "blogs public read"  on public.blogs;
create policy "blogs public read" on public.blogs
  for select using (true);

drop policy if exists "blogs admin write" on public.blogs;
create policy "blogs admin write" on public.blogs
  for all to authenticated using (true) with check (true);

-- ---- CONTACT SUBMISSIONS --------------------------------------------------
-- Anyone can submit (insert). Only admins can read/update/delete.
drop policy if exists "contact public insert" on public.contact_submissions;
create policy "contact public insert" on public.contact_submissions
  for insert with check (true);

drop policy if exists "contact admin read" on public.contact_submissions;
create policy "contact admin read" on public.contact_submissions
  for select to authenticated using (true);

drop policy if exists "contact admin update" on public.contact_submissions;
create policy "contact admin update" on public.contact_submissions
  for update to authenticated using (true) with check (true);

drop policy if exists "contact admin delete" on public.contact_submissions;
create policy "contact admin delete" on public.contact_submissions
  for delete to authenticated using (true);

-- ============================================================================
-- STORAGE  — bucket "media" for all admin image uploads
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media admin insert" on storage.objects;
create policy "media admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');

drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects
  for update to authenticated using (bucket_id = 'media');

drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media');

-- Done. Next: create your admin user (see supabase/README.md).
