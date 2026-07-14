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
// Products
// ---------------------------------------------------------------------------
export const productsApi = {
  /**
   * @param {object} opts
   * @param {boolean} opts.activeOnly
   * @param {string}  opts.categoryId
   * @param {number}  opts.limit
   */
  async list({ activeOnly = false, categoryId = null, limit = null } = {}) {
    let q = supabase
      .from('products')
      .select('*, category:categories(id,name,slug)')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (activeOnly) q = q.eq('is_active', true);
    if (categoryId) q = q.eq('category_id', categoryId);
    if (limit) q = q.limit(limit);
    const { data, error } = await q;
    throwIf(error);
    return data;
  },

  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(id,name,slug)')
      .eq('slug', slug)
      .maybeSingle();
    throwIf(error);
    return data;
  },

  async get(id) {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(id,name,slug)')
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
