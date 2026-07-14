-- ============================================================================
-- Cavier — seed data (optional)
-- Run AFTER schema.sql, in the Supabase SQL Editor.
-- Recreates the site's original hard-coded content so pages aren't empty.
-- Re-runnable: matches on slug and updates.
-- Images reference files already in /public/images.
-- ============================================================================

-- ---- CATEGORIES -----------------------------------------------------------
insert into public.categories (name, slug, description, hero_image, card_image, show_on_home, home_order, sort_order, is_active)
values
  ('Health Faucets', 'health-faucets',
   'Ergonomic health faucets engineered for everyday comfort and reliability.',
   '/images/category_hero_banner.png', '/images/Health%20faucets.png', true, 1, 1, true),
  ('Opal Prime', 'opal-prime',
   'The Opal Prime collection — refined silhouettes with a premium finish.',
   '/images/category_hero_banner.png', '/images/Opal%20Prime.png', true, 2, 2, true),
  ('Cavier Sink Mixers', 'sink-mixers',
   'Precision sink mixers with smooth ceramic-disc operation.',
   '/images/category_hero_banner.png', '/images/product1.png', true, 3, 3, true),
  ('Bathroom Accessories', 'bathroom-accessories',
   'Coordinated accessories to complete a cohesive bath space.',
   '/images/category_hero_banner.png', '/images/accessories_category.png', true, 4, 4, true),
  ('Bathroom Fitting', 'bathroom-fitting',
   'Contemporary bathroom fittings crafted from premium brass.',
   '/images/category_hero_banner.png', '/images/fitting_category.png', false, 0, 5, true)
on conflict (slug) do update set
  name = excluded.name, description = excluded.description,
  hero_image = excluded.hero_image, card_image = excluded.card_image,
  show_on_home = excluded.show_on_home, home_order = excluded.home_order,
  sort_order = excluded.sort_order, is_active = excluded.is_active;

-- ---- PRODUCTS -------------------------------------------------------------
-- Common finishes reused across products.
-- Chrome / Gold / Rose Gold / Gunmetal with CSS filters matching ProductDetail.
with cat as (
  select slug, id from public.categories
)
insert into public.products
  (name, slug, code, category_id, price, short_desc, description, main_image, gallery, finishes, features, specifications, rating, is_active, sort_order)
select v.name, v.slug, v.code, cat.id, v.price, v.short_desc, v.description, v.main_image,
       v.gallery::jsonb, v.finishes::jsonb, v.features::jsonb, v.specifications::jsonb, 5, true, v.sort_order
from cat
join (values
  ('SO 04 101 | Pillar Cock with Base', 'so-04-101-pillar-cock', 'SO 04 101', 'sink-mixers', 1930,
   'Fully brass pillar cock with a sturdy base.',
   'Fully Brass Faucets made out of Brass Ingots. Flow rate: 13.5 LPM at 3 bar pressure. Sturdy brass aerator housing.',
   '/images/productt.png',
   '["/images/productt.png","/images/productt_2.png","/images/productt_3.png","/images/productt_4.png"]',
   '[{"name":"Chrome","color":"#E8E8E8","filter":"grayscale(0) brightness(1) contrast(1)"},{"name":"Gold","color":"#D4B678","filter":"sepia(1) hue-rotate(5deg) saturate(1.8) brightness(0.9) contrast(1.1)"},{"name":"Rose Gold","color":"#C27B5C","filter":"sepia(1) hue-rotate(-20deg) saturate(1.5) brightness(0.9) contrast(1.1)"},{"name":"Gunmetal","color":"#6B6B6B","filter":"grayscale(1) brightness(0.6) contrast(1.4)"}]',
   '["10 Years Warranty against manufacturing defects","Dynamic colour options","Imported bought-out parts","1,00,000 life-cycle tested spindles","Passed 120 hours anti-corrosion finish test"]',
   '[{"label":"Flow rate","value":"13.5 LPM at 3 bar"},{"label":"Material","value":"Brass"}]', 1),
  ('SO 04 102 | Bib Cock with Wall Flange', 'so-04-102-bib-cock', 'SO 04 102', 'sink-mixers', 1540,
   'Long-body bib cock with wall flange.', 'Premium brass bib cock with a chrome-plated wall flange.',
   '/images/productt_2.png',
   '["/images/productt_2.png","/images/productt_3.png"]',
   '[{"name":"Chrome","color":"#E8E8E8","filter":"grayscale(0) brightness(1) contrast(1)"},{"name":"Gold","color":"#D4B678","filter":"sepia(1) hue-rotate(5deg) saturate(1.8) brightness(0.9) contrast(1.1)"}]',
   '["10 Years Warranty","Ceramic disc cartridge","Anti-corrosion finish"]', '[]', 2),
  ('SO 04 103 | Angle Valve', 'so-04-103-angle-valve', 'SO 04 103', 'sink-mixers', 1200,
   'Quarter-turn angle valve.', 'Durable brass angle valve with quarter-turn ceramic cartridge.',
   '/images/productt_3.png', '["/images/productt_3.png"]',
   '[{"name":"Chrome","color":"#E8E8E8","filter":"grayscale(0) brightness(1) contrast(1)"}]',
   '["Quarter-turn operation","Brass body"]', '[]', 3),
  ('SO 04 106 | Sink Mixer with Swinging Spout', 'so-04-106-sink-mixer', 'SO 04 106', 'sink-mixers', 4250,
   'Sink mixer with 360° swinging spout.', 'Single-lever sink mixer with a smooth 360-degree swinging spout.',
   '/images/productt_6.png', '["/images/productt_6.png"]',
   '[{"name":"Chrome","color":"#E8E8E8","filter":"grayscale(0) brightness(1) contrast(1)"},{"name":"Gunmetal","color":"#6B6B6B","filter":"grayscale(1) brightness(0.6) contrast(1.4)"}]',
   '["Single lever","Swinging spout","10 Years Warranty"]', '[]', 4),
  ('HF 01 | Premium Health Faucet', 'hf-01-health-faucet', 'HF 01', 'health-faucets', 990,
   'ABS health faucet with brass insert.', 'Ergonomic health faucet with a 1-metre flexible tube and wall hook.',
   '/images/Health%20faucets.png', '["/images/Health%20faucets.png","/images/Health%20faucets_2.png"]',
   '[{"name":"Chrome","color":"#E8E8E8","filter":"grayscale(0) brightness(1) contrast(1)"}]',
   '["Trigger control","Flexible tube","Wall hook included"]', '[]', 1),
  ('HF 02 | Health Faucet Deluxe', 'hf-02-health-faucet', 'HF 02', 'health-faucets', 1150,
   'Deluxe health faucet.', 'Deluxe health faucet with a soft-touch trigger and premium finish.',
   '/images/Health%20faucets_3.png', '["/images/Health%20faucets_3.png","/images/Health%20faucets_4.png"]',
   '[{"name":"Chrome","color":"#E8E8E8","filter":"grayscale(0) brightness(1) contrast(1)"},{"name":"Gold","color":"#D4B678","filter":"sepia(1) hue-rotate(5deg) saturate(1.8) brightness(0.9) contrast(1.1)"}]',
   '["Soft-touch trigger","Premium finish"]', '[]', 2),
  ('OP 01 | Opal Prime Basin Mixer', 'op-01-basin-mixer', 'OP 01', 'opal-prime', 2450,
   'Opal Prime single-lever basin mixer.', 'Single-lever basin mixer from the Opal Prime line with refined detailing.',
   '/images/Opal%20Prime.png', '["/images/Opal%20Prime.png","/images/Opal%20Prime_2.png"]',
   '[{"name":"Chrome","color":"#E8E8E8","filter":"grayscale(0) brightness(1) contrast(1)"},{"name":"Rose Gold","color":"#C27B5C","filter":"sepia(1) hue-rotate(-20deg) saturate(1.5) brightness(0.9) contrast(1.1)"}]',
   '["Single lever","Ceramic cartridge","10 Years Warranty"]', '[]', 1),
  ('OP 02 | Opal Prime Wall Mixer', 'op-02-wall-mixer', 'OP 02', 'opal-prime', 3120,
   'Opal Prime wall mixer.', 'Wall mixer with diverter from the Opal Prime collection.',
   '/images/Opal%20Prime_3.png', '["/images/Opal%20Prime_3.png","/images/Opal%20Prime_4.png"]',
   '[{"name":"Chrome","color":"#E8E8E8","filter":"grayscale(0) brightness(1) contrast(1)"}]',
   '["Diverter","Brass body"]', '[]', 2),
  ('BA 01 | Towel Rod', 'ba-01-towel-rod', 'BA 01', 'bathroom-accessories', 1600,
   '600mm brass towel rod.', 'Premium 600mm towel rod in solid brass with concealed fixing.',
   '/images/product2.png', '["/images/product2.png"]',
   '[{"name":"Chrome","color":"#E8E8E8","filter":"grayscale(0) brightness(1) contrast(1)"},{"name":"Matte Black","color":"#2B2B2B","filter":"grayscale(1) brightness(0.4) contrast(1.2)"}]',
   '["Concealed fixing","Solid brass"]', '[]', 1),
  ('BA 02 | Robe Hook', 'ba-02-robe-hook', 'BA 02', 'bathroom-accessories', 480,
   'Dual robe hook.', 'Solid brass dual robe hook with a scratch-resistant finish.',
   '/images/product3.png', '["/images/product3.png"]',
   '[{"name":"Chrome","color":"#E8E8E8","filter":"grayscale(0) brightness(1) contrast(1)"}]',
   '["Dual hook","Scratch resistant"]', '[]', 2)
) as v(name, slug, code, cat_slug, price, short_desc, description, main_image, gallery, finishes, features, specifications, sort_order)
  on (cat.slug = v.cat_slug)
on conflict (slug) do update set
  name = excluded.name, code = excluded.code, category_id = excluded.category_id,
  price = excluded.price, short_desc = excluded.short_desc, description = excluded.description,
  main_image = excluded.main_image, gallery = excluded.gallery, finishes = excluded.finishes,
  features = excluded.features, specifications = excluded.specifications, sort_order = excluded.sort_order;
