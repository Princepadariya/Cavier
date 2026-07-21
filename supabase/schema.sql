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
-- SERIES
-- Sub-categories that live inside a category (e.g. Health Faucets → "Solo",
-- "Body Jet"). Products optionally belong to one series.
-- ---------------------------------------------------------------------------
create table if not exists public.series (
  id           uuid primary key default gen_random_uuid(),
  category_id  uuid not null references public.categories(id) on delete cascade,
  name         text not null,
  slug         text not null,
  description  text default '',
  image        text,
  sort_order   integer not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (category_id, slug)
);

create index if not exists idx_series_category on public.series(category_id);
create index if not exists idx_series_active   on public.series(is_active);

drop trigger if exists trg_series_updated on public.series;
create trigger trg_series_updated before update on public.series
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
  series_id     uuid references public.series(id) on delete set null,
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
  view_count    integer not null default 0,      -- bumped each time the product page is opened
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Safety net: adds the column when this table already existed before series
-- was introduced (create table if not exists won't alter an existing table).
alter table public.products add column if not exists series_id  uuid references public.series(id) on delete set null;
alter table public.products add column if not exists view_count integer not null default 0;

create index if not exists idx_products_category   on public.products(category_id);
create index if not exists idx_products_series     on public.products(series_id);
create index if not exists idx_products_active     on public.products(is_active);
create index if not exists idx_products_view_count on public.products(view_count desc);

-- Atomic view counter — SECURITY DEFINER so anonymous visitors can bump the
-- counter without needing a general write policy on the products table.
create or replace function public.increment_product_view(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.products set view_count = view_count + 1 where id = p_id;
end;
$$;

grant execute on function public.increment_product_view(uuid) to anon, authenticated;

drop trigger if exists trg_products_updated on public.products;
create trigger trg_products_updated before update on public.products
  for each row execute function public.set_updated_at();

-- Guarantees a product's series (if any) actually belongs to the product's
-- own category — enforced in the database, not just filtered in the admin UI.
create or replace function public.check_product_series_category()
returns trigger language plpgsql as $$
begin
  if new.series_id is not null then
    if not exists (
      select 1 from public.series s where s.id = new.series_id and s.category_id = new.category_id
    ) then
      raise exception 'series % does not belong to category %', new.series_id, new.category_id;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_products_series_category_check on public.products;
create trigger trg_products_series_category_check before insert or update on public.products
  for each row execute function public.check_product_series_category();

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
-- TESTIMONIALS
-- Shown in the "Experiences That Speak for Quality" card carousel on the
-- home page. Ordered by sort_order.
-- ---------------------------------------------------------------------------
create table if not exists public.testimonials (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  role         text default '',                 -- e.g. "Distributor", "Architect"
  quote        text not null,
  rating       integer not null default 5,      -- 1-5 stars
  is_active    boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_testimonials_active on public.testimonials(is_active);

drop trigger if exists trg_testimonials_updated on public.testimonials;
create trigger trg_testimonials_updated before update on public.testimonials
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

-- ---------------------------------------------------------------------------
-- SITE SETTINGS
-- Singleton row (id is always `true`) holding site-wide toggles, e.g. whether
-- the homepage automatically shows a Bestsellers row driven by product views.
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  id                        boolean primary key default true,
  bestseller_auto_enabled   boolean not null default true,
  updated_at                timestamptz not null default now(),
  constraint site_settings_singleton check (id)
);

insert into public.site_settings (id) values (true) on conflict (id) do nothing;

drop trigger if exists trg_site_settings_updated on public.site_settings;
create trigger trg_site_settings_updated before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY
-- Public (anon) users: read active content + submit contact form.
-- Authenticated users (your admins): full read/write on everything.
-- ============================================================================
alter table public.categories          enable row level security;
alter table public.series              enable row level security;
alter table public.products            enable row level security;
alter table public.blogs               enable row level security;
alter table public.testimonials        enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.site_settings       enable row level security;

-- ---- CATEGORIES -----------------------------------------------------------
drop policy if exists "categories public read"  on public.categories;
create policy "categories public read" on public.categories
  for select using (true);

drop policy if exists "categories admin write" on public.categories;
create policy "categories admin write" on public.categories
  for all to authenticated using (true) with check (true);

-- ---- SERIES -----------------------------------------------------------
drop policy if exists "series public read"  on public.series;
create policy "series public read" on public.series
  for select using (true);

drop policy if exists "series admin write" on public.series;
create policy "series admin write" on public.series
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

-- ---- TESTIMONIALS -----------------------------------------------------------
drop policy if exists "testimonials public read"  on public.testimonials;
create policy "testimonials public read" on public.testimonials
  for select using (true);

drop policy if exists "testimonials admin write" on public.testimonials;
create policy "testimonials admin write" on public.testimonials
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

-- ---- SITE SETTINGS ---------------------------------------------------------
-- Anyone can read the toggle (so the public site knows whether to render the
-- Bestsellers row). Only admins can change it.
drop policy if exists "site_settings public read" on public.site_settings;
create policy "site_settings public read" on public.site_settings
  for select using (true);

drop policy if exists "site_settings admin write" on public.site_settings;
create policy "site_settings admin write" on public.site_settings
  for all to authenticated using (true) with check (true);

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
