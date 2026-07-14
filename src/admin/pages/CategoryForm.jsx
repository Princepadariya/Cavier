import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { categoriesApi, slugify } from '../../lib/api';
import { Button, Card, Field, Input, Textarea, Toggle, Spinner } from '../components/ui';
import { ImageUpload } from '../components/ImageUpload';

const empty = {
  name: '',
  slug: '',
  description: '',
  hero_image: '',
  card_image: '',
  show_on_home: false,
  home_order: 0,
  sort_order: 0,
  is_active: true,
};

export default function CategoryForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const cat = await categoriesApi.get(id);
        if (cat) {
          setForm(cat);
          setSlugTouched(true);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      description: form.description,
      hero_image: form.hero_image || null,
      card_image: form.card_image || null,
      show_on_home: form.show_on_home,
      home_order: Number(form.home_order) || 0,
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active,
    };
    try {
      if (isEdit) await categoriesApi.update(id, payload);
      else await categoriesApi.create(payload);
      navigate('/admin/categories');
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
    <div className="max-w-3xl">
      <Link to="/admin/categories" className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900">
        <ArrowLeft size={15} /> Categories
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">{isEdit ? 'Edit category' : 'New category'}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <Card className="space-y-5 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" required>
              <Input value={form.name} onChange={(e) => onNameChange(e.target.value)} required placeholder="Health Faucets" />
            </Field>
            <Field label="Slug" hint="Used in the URL. Auto-generated from the name.">
              <Input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set('slug', slugify(e.target.value));
                }}
                placeholder="health-faucets"
              />
            </Field>
          </div>

          <Field label="Description">
            <Textarea
              rows={3}
              value={form.description || ''}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Short description shown on the category page."
            />
          </Field>
        </Card>

        <Card className="grid gap-6 p-6 sm:grid-cols-2">
          <ImageUpload
            label="Card image (home + listings)"
            folder="categories"
            aspect="aspect-[4/5]"
            value={form.card_image}
            onChange={(url) => set('card_image', url)}
          />
          <ImageUpload
            label="Hero banner (category page)"
            folder="categories"
            aspect="aspect-video"
            value={form.hero_image}
            onChange={(url) => set('hero_image', url)}
          />
        </Card>

        <Card className="space-y-5 p-6">
          <Toggle
            checked={form.show_on_home}
            onChange={(v) => set('show_on_home', v)}
            label="Feature on home page (renders a product row)"
          />
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Home order" hint="Lower shows first">
              <Input type="number" value={form.home_order} onChange={(e) => set('home_order', e.target.value)} />
            </Field>
            <Field label="Listing order" hint="Lower shows first">
              <Input type="number" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} />
            </Field>
            <div className="flex items-end">
              <Toggle checked={form.is_active} onChange={(v) => set('is_active', v)} label="Active" />
            </div>
          </div>
        </Card>

        {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 size={16} className="animate-spin" />}
            {isEdit ? 'Save changes' : 'Create category'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/categories')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
