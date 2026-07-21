import { supabase, STORAGE_BUCKET } from './supabase';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Turn a title into a url-safe slug. */
export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function throwIf(error) {
  if (error) throw new Error(error.message || 'Request failed');
}

/**
 * Upload a File to the media bucket and return its public URL.
 * @param {File} file
 * @param {string} folder  e.g. 'products' | 'categories' | 'blogs'
 */
export async function uploadImage(file, folder = 'misc') {
  const ext = file.name.split('.').pop();
  const name = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(name, file, { cacheControl: '3600', upsert: false });
  throwIf(error);
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(name);
  return data.publicUrl;
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------
export const categoriesApi = {
  async list({ activeOnly = false } = {}) {
    let q = supabase.from('categories').select('*').order('sort_order', { ascending: true });
    if (activeOnly) q = q.eq('is_active', true);
    const { data, error } = await q;
    throwIf(error);
    return data;
  },

  async homeFeatured() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .eq('show_on_home', true)
      .order('home_order', { ascending: true });
    throwIf(error);
    return data;
  },

  async getBySlug(slug) {
    const { data, error } = await supabase.from('categories').select('*').eq('slug', slug).maybeSingle();
    throwIf(error);
    return data;
  },

  async get(id) {
    const { data, error } = await supabase.from('categories').select('*').eq('id', id).maybeSingle();
    throwIf(error);
    return data;
  },

  async create(payload) {
    const { data, error } = await supabase.from('categories').insert(payload).select().single();
    throwIf(error);
    return data;
  },

  async update(id, payload) {
    const { data, error } = await supabase.from('categories').update(payload).eq('id', id).select().single();
    throwIf(error);
    return data;
  },

  async remove(id) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    throwIf(error);
  },
};

// ---------------------------------------------------------------------------
// Series (sub-categories that live inside a category)
// ---------------------------------------------------------------------------
export const seriesApi = {
  /**
   * @param {object} opts
   * @param {boolean} opts.activeOnly
   * @param {string}  opts.categoryId
   */
  async list({ activeOnly = false, categoryId = null } = {}) {
    let q = supabase
      .from('series')
      .select('*, category:categories(id,name,slug)')
      .order('sort_order', { ascending: true });
    if (activeOnly) q = q.eq('is_active', true);
    if (categoryId) q = q.eq('category_id', categoryId);
    const { data, error } = await q;
    throwIf(error);
    return data;
  },

  async get(id) {
    const { data, error } = await supabase.from('series').select('*').eq('id', id).maybeSingle();
    throwIf(error);
    return data;
  },

  async create(payload) {
    const { data, error } = await supabase.from('series').insert(payload).select().single();
    throwIf(error);
    return data;
  },

  async update(id, payload) {
    const { data, error } = await supabase.from('series').update(payload).eq('id', id).select().single();
    throwIf(error);
    return data;
  },

  async remove(id) {
    const { error } = await supabase.from('series').delete().eq('id', id);
    throwIf(error);
  },
};

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
export const productsApi = {
  /**
   * @param {object} opts
   * @param {boolean} opts.activeOnly
   * @param {string}  opts.categoryId
   * @param {string}  opts.seriesId
   * @param {number}  opts.limit
   */
  async list({ activeOnly = false, categoryId = null, seriesId = null, limit = null } = {}) {
    let q = supabase
      .from('products')
      .select('*, category:categories(id,name,slug), series:series(id,name,slug)')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (activeOnly) q = q.eq('is_active', true);
    if (categoryId) q = q.eq('category_id', categoryId);
    if (seriesId) q = q.eq('series_id', seriesId);
    if (limit) q = q.limit(limit);
    const { data, error } = await q;
    throwIf(error);
    return data;
  },

  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(id,name,slug), series:series(id,name,slug)')
      .eq('slug', slug)
      .maybeSingle();
    throwIf(error);
    return data;
  },

  async get(id) {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(id,name,slug), series:series(id,name,slug)')
      .eq('id', id)
      .maybeSingle();
    throwIf(error);
    return data;
  },

  async create(payload) {
    const { data, error } = await supabase.from('products').insert(payload).select().single();
    throwIf(error);
    return data;
  },

  async update(id, payload) {
    const { data, error } = await supabase.from('products').update(payload).eq('id', id).select().single();
    throwIf(error);
    return data;
  },

  async remove(id) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    throwIf(error);
  },

  /** Top viewed products, for the automatic Bestsellers section / admin analytics. */
  async topViewed({ activeOnly = false, limit = 8 } = {}) {
    let q = supabase
      .from('products')
      .select('*, category:categories(id,name,slug), series:series(id,name,slug)')
      .order('view_count', { ascending: false })
      .limit(limit);
    if (activeOnly) q = q.eq('is_active', true);
    const { data, error } = await q;
    throwIf(error);
    return data;
  },

  /** Fire-and-forget view counter bump — call when a product detail page opens. */
  async incrementView(id) {
    const { error } = await supabase.rpc('increment_product_view', { p_id: id });
    throwIf(error);
  },
};

// ---------------------------------------------------------------------------
// Site settings (singleton row)
// ---------------------------------------------------------------------------
export const settingsApi = {
  async get() {
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', true).maybeSingle();
    throwIf(error);
    return data;
  },

  async update(payload) {
    const { data, error } = await supabase.from('site_settings').update(payload).eq('id', true).select().single();
    throwIf(error);
    return data;
  },
};

// ---------------------------------------------------------------------------
// Blogs
// ---------------------------------------------------------------------------
export const blogsApi = {
  async list({ publishedOnly = false } = {}) {
    let q = supabase.from('blogs').select('*').order('published_at', { ascending: false });
    if (publishedOnly) q = q.eq('is_published', true);
    const { data, error } = await q;
    throwIf(error);
    return data;
  },

  async getBySlug(slug) {
    const { data, error } = await supabase.from('blogs').select('*').eq('slug', slug).maybeSingle();
    throwIf(error);
    return data;
  },

  async get(id) {
    const { data, error } = await supabase.from('blogs').select('*').eq('id', id).maybeSingle();
    throwIf(error);
    return data;
  },

  async create(payload) {
    const { data, error } = await supabase.from('blogs').insert(payload).select().single();
    throwIf(error);
    return data;
  },

  async update(id, payload) {
    const { data, error } = await supabase.from('blogs').update(payload).eq('id', id).select().single();
    throwIf(error);
    return data;
  },

  async remove(id) {
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    throwIf(error);
  },
};

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------
export const testimonialsApi = {
  async list({ activeOnly = false } = {}) {
    let q = supabase.from('testimonials').select('*').order('sort_order', { ascending: true });
    if (activeOnly) q = q.eq('is_active', true);
    const { data, error } = await q;
    throwIf(error);
    return data;
  },

  async get(id) {
    const { data, error } = await supabase.from('testimonials').select('*').eq('id', id).maybeSingle();
    throwIf(error);
    return data;
  },

  async create(payload) {
    const { data, error } = await supabase.from('testimonials').insert(payload).select().single();
    throwIf(error);
    return data;
  },

  async update(id, payload) {
    const { data, error } = await supabase.from('testimonials').update(payload).eq('id', id).select().single();
    throwIf(error);
    return data;
  },

  async remove(id) {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    throwIf(error);
  },
};

// ---------------------------------------------------------------------------
// Contact submissions
// ---------------------------------------------------------------------------
export const contactApi = {
  async submit(payload) {
    const { error } = await supabase.from('contact_submissions').insert(payload);
    throwIf(error);
  },

  async list() {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    throwIf(error);
    return data;
  },

  async markRead(id, isRead = true) {
    const { error } = await supabase.from('contact_submissions').update({ is_read: isRead }).eq('id', id);
    throwIf(error);
  },

  async remove(id) {
    const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
    throwIf(error);
  },
};
