import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Plus, X } from 'lucide-react';
import { productsApi, categoriesApi, slugify } from '../../lib/api';
import { Button, Card, Field, Input, Textarea, Select, Toggle, Spinner } from '../components/ui';
import { ImageUpload, GalleryUpload } from '../components/ImageUpload';

// Preset finishes with the CSS filters used by the product detail page to tint
// the product image. Admins can add these with one click or define custom ones.
const PRESET_FINISHES = [
  { name: 'Chrome', color: '#E8E8E8', filter: 'grayscale(0) brightness(1) contrast(1)' },
  { name: 'Gold', color: '#D4B678', filter: 'sepia(1) hue-rotate(5deg) saturate(1.8) brightness(0.9) contrast(1.1)' },
  { name: 'Rose Gold', color: '#C27B5C', filter: 'sepia(1) hue-rotate(-20deg) saturate(1.5) brightness(0.9) contrast(1.1)' },
  { name: 'Gunmetal', color: '#6B6B6B', filter: 'grayscale(1) brightness(0.6) contrast(1.4)' },
  { name: 'Matte Black', color: '#2B2B2B', filter: 'grayscale(1) brightness(0.4) contrast(1.2)' },
];

const empty = {
  name: '',
  slug: '',
  code: '',
  category_id: '',
  price: '',
  short_desc: '',
  description: '',
  main_image: '',
  gallery: [],
  finishes: [],
  features: [],
  specifications: [],
  rating: 5,
  is_active: true,
  sort_order: 0,
};

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [categories, setCategories] = useState([]);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const cats = await categoriesApi.list();
        setCategories(cats);
        if (isEdit) {
          const p = await productsApi.get(id);
          if (p) {
            setForm({
              ...empty,
              ...p,
              price: p.price ?? '',
              gallery: p.gallery || [],
              finishes: p.finishes || [],
              features: p.features || [],
              specifications: p.specifications || [],
            });
            setSlugTouched(true);
          }
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const onNameChange = (v) => {
    set('name', v);
    if (!slugTouched) set('slug', slugify(v));
  };

  // ---- finishes ----
  const addPresetFinish = (preset) => {
    if (form.finishes.some((f) => f.name === preset.name)) return;
    set('finishes', [...form.finishes, preset]);
  };
  const addCustomFinish = () =>
    set('finishes', [...form.finishes, { name: '', color: '#cccccc', filter: 'grayscale(0) brightness(1) contrast(1)' }]);
  const updateFinish = (i, key, value) =>
    set('finishes', form.finishes.map((f, idx) => (idx === i ? { ...f, [key]: value } : f)));
  const removeFinish = (i) => set('finishes', form.finishes.filter((_, idx) => idx !== i));

  // ---- features ----
  const addFeature = () => set('features', [...form.features, '']);
  const updateFeature = (i, value) => set('features', form.features.map((f, idx) => (idx === i ? value : f)));
  const removeFeature = (i) => set('features', form.features.filter((_, idx) => idx !== i));

  // ---- specifications ----
  const addSpec = () => set('specifications', [...form.specifications, { label: '', value: '' }]);
  const updateSpec = (i, key, value) =>
    set('specifications', form.specifications.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)));
  const removeSpec = (i) => set('specifications', form.specifications.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      code: form.code.trim(),
      category_id: form.category_id || null,
      price: Number(form.price) || 0,
      short_desc: form.short_desc,
      description: form.description,
      main_image: form.main_image || null,
      gallery: form.gallery,
      finishes: form.finishes.filter((f) => f.name.trim()),
      features: form.features.filter((f) => f.trim()),
      specifications: form.specifications.filter((s) => s.label.trim() || s.value.trim()),
      rating: Number(form.rating) || 5,
      is_active: form.is_active,
      sort_order: Number(form.sort_order) || 0,
    };
    try {
      if (isEdit) await productsApi.update(id, payload);
      else await productsApi.create(payload);
      navigate('/admin/products');
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-7 w-7" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <Link to="/admin/products" className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900">
        <ArrowLeft size={15} /> Products
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">{isEdit ? 'Edit product' : 'New product'}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Basic info */}
        <Card className="space-y-5 p-6">
          <div className="grid gap-5">
            <Field label="Name" required>
              <Input value={form.name} onChange={(e) => onNameChange(e.target.value)} required placeholder="Pillar Cock with Base" />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Slug">
              <Input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set('slug', slugify(e.target.value));
                }}
              />
            </Field>
            <Field label="Category" required>
              <Select value={form.category_id || ''} onChange={(e) => set('category_id', e.target.value)} required>
                <option value="">Select…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Price (₹)" required>
              <Input type="number" min="0" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)} required placeholder="1930" />
            </Field>
          </div>
          <Field label="Short description" hint="One line — shown under the product name.">
            <Input value={form.short_desc} onChange={(e) => set('short_desc', e.target.value)} />
          </Field>
          <Field label="Full description">
            <Textarea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </Field>
        </Card>

        {/* Images */}
        <Card className="space-y-6 p-6">
          <h2 className="text-sm font-semibold text-neutral-700">Images</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <ImageUpload
              label="Main image"
              folder="products"
              aspect="aspect-square"
              value={form.main_image}
              onChange={(url) => set('main_image', url)}
            />
            <GalleryUpload
              label="Gallery / thumbnails"
              folder="products"
              value={form.gallery}
              onChange={(urls) => set('gallery', urls)}
            />
          </div>
        </Card>

        {/* Finishes */}
        <Card className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-700">Colour finishes</h2>
            <span className="text-xs text-neutral-400">Used as swatches on the product page</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_FINISHES.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => addPresetFinish(p)}
                className="flex items-center gap-2 rounded-full border border-neutral-200 py-1 pl-1.5 pr-3 text-xs font-medium text-neutral-600 hover:border-neutral-900"
              >
                <span className="h-4 w-4 rounded-full border border-black/10" style={{ background: p.color }} />
                {p.name}
              </button>
            ))}
            <button
              type="button"
              onClick={addCustomFinish}
              className="flex items-center gap-1 rounded-full border border-dashed border-neutral-300 px-3 py-1 text-xs font-medium text-neutral-500 hover:border-neutral-900"
            >
              <Plus size={13} /> Custom
            </button>
          </div>

          {form.finishes.length > 0 && (
            <div className="space-y-2">
              {form.finishes.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={f.color}
                    onChange={(e) => updateFinish(i, 'color', e.target.value)}
                    className="h-9 w-10 shrink-0 cursor-pointer rounded border border-neutral-200"
                  />
                  <Input
                    value={f.name}
                    onChange={(e) => updateFinish(i, 'name', e.target.value)}
                    placeholder="Finish name"
                    className="sm:w-40"
                  />
                  <Input
                    value={f.filter}
                    onChange={(e) => updateFinish(i, 'filter', e.target.value)}
                    placeholder="CSS filter (tints the image)"
                    className="flex-1 font-mono text-xs"
                  />
                  <button type="button" onClick={() => removeFinish(i)} className="rounded-md p-2 text-neutral-400 hover:bg-red-50 hover:text-red-600">
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Features & specs */}
        <Card className="grid gap-6 p-6 sm:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-neutral-700">Key features</h2>
            {form.features.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input value={f} onChange={(e) => updateFeature(i, e.target.value)} placeholder="10 Years Warranty…" />
                <button type="button" onClick={() => removeFeature(i)} className="rounded-md p-2 text-neutral-400 hover:bg-red-50 hover:text-red-600">
                  <X size={15} />
                </button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addFeature} className="text-xs">
              <Plus size={14} /> Add feature
            </Button>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-neutral-700">Specifications</h2>
            {form.specifications.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input value={s.label} onChange={(e) => updateSpec(i, 'label', e.target.value)} placeholder="Flow rate" className="w-1/3" />
                <Input value={s.value} onChange={(e) => updateSpec(i, 'value', e.target.value)} placeholder="13.5 LPM" className="flex-1" />
                <button type="button" onClick={() => removeSpec(i)} className="rounded-md p-2 text-neutral-400 hover:bg-red-50 hover:text-red-600">
                  <X size={15} />
                </button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addSpec} className="text-xs">
              <Plus size={14} /> Add specification
            </Button>
          </div>
        </Card>

        {/* Meta */}
        <Card className="grid gap-5 p-6 sm:grid-cols-2">
          <Field label="Sort order" hint="Lower shows first">
            <Input type="number" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} />
          </Field>
          <div className="flex items-end">
            <Toggle checked={form.is_active} onChange={(v) => set('is_active', v)} label="Active (visible on site)" />
          </div>
        </Card>

        {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 size={16} className="animate-spin" />}
            {isEdit ? 'Save changes' : 'Create product'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
