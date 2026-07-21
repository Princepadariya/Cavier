# Supabase setup for Cavier

One-time setup so the site + admin panel can read/write data. ~5 minutes.

## 1. Run the schema

1. Open your project → **SQL Editor** → **New query**.
2. Paste the entire contents of [`schema.sql`](./schema.sql) and click **Run**.
   This creates the `categories`, `products`, `blogs`, `testimonials`,
   `contact_submissions` tables, the `media` storage bucket, and all the
   security (RLS) policies. It's safe to re-run any time you pull an update
   that adds a new table (like `testimonials`) — existing tables are left
   untouched.

## 2. (Optional) Seed sample content

Paste [`seed.sql`](./seed.sql) into a new SQL Editor query and **Run** it to
recreate the original hard-coded categories and products so the pages aren't
empty on first load. You can delete/edit all of it later from the admin panel.

## 3. Create your admin login

The admin panel uses Supabase Auth. Create your first admin user:

1. Go to **Authentication → Users → Add user → Create new user**.
2. Enter an email + password, and tick **Auto Confirm User**.
3. That's it — sign in at `/admin/login` with those credentials.

> Any confirmed Supabase Auth user can access the admin panel. Only create
> accounts for people who should be admins. To add more admins, repeat step 3.

## 4. Environment variables

Already wired in [`.env`](../.env):

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

(This is a **Vite** app, so the variables use the `VITE_` prefix — the
`NEXT_PUBLIC_` prefix from Next.js won't work here.)

Restart `npm run dev` after any `.env` change.

## Data model quick reference

| Table | Key fields |
|-------|-----------|
| `categories` | `name, slug, hero_image, card_image, show_on_home, home_order, sort_order, is_active` |
| `series` | `category_id, name, slug, description, image, sort_order, is_active` |
| `products` | `name, slug, code, category_id, series_id, price, main_image, gallery[], finishes[], features[], specifications[], is_active, sort_order, view_count` |
| `site_settings` | singleton row — `bestseller_auto_enabled` |
| `blogs` | `title, slug, author, header_image, excerpt, content[] (blocks), is_published` |
| `testimonials` | `name, role, quote, rating, sort_order, is_active` |
| `contact_submissions` | `name, email, contact, designation, subject, message, is_read` |

- **Blog `content`** is an array of blocks: `{type:'heading'|'paragraph'|'image', text|url}`.
- **Product `finishes`** are `{name, color, filter}` where `filter` is a CSS filter string used to tint the product image on the detail page.
