import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { seriesApi, categoriesApi, slugify } from '../../lib/api';
import { Button, Card, Field, Input, Textarea, Select, Toggle, Spinner } from '../components/ui';
import { ImageUpload } from '../components/ImageUpload';

const empty = {
  category_id: '',
  name: '',
  slug: '',
  description: '',
  image: '',
  sort_order: 0,
  is_active: true,
};

export default function SeriesForm() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({ ...empty, category_id: searchParams.get('category') || '' });
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
          const s = await seriesApi.get(id);
          if (s) {
            setForm(s);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload = {
      category_id: form.category_id || null,
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      description: form.description,
      image: form.image || null,
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active,
    };
    try {
      if (isEdit) await seriesApi.update(id, payload);
      else await seriesApi.create(payload);
      navigate('/admin/series');
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
      <Link to="/admin/series" className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900">
        <ArrowLeft size={15} /> Series
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">{isEdit ? 'Edit series' : 'New series'}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <Card className="space-y-5 p-6">
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

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" required>
              <Input value={form.name} onChange={(e) => onNameChange(e.target.value)} required placeholder="Solo" />
            </Field>
            <Field label="Slug" hint="Auto-generated from the name.">
              <Input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set('slug', slugify(e.target.value));
                }}
                placeholder="solo"
              />
            </Field>
          </div>

          <Field label="Description">
            <Textarea
              rows={3}
              value={form.description || ''}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Short description for this series."
            />
          </Field>
        </Card>

        <Card className="p-6">
          <ImageUpload
            label="Series image"
            folder="series"
            aspect="aspect-[4/5]"
            value={form.image}
            onChange={(url) => set('image', url)}
          />
        </Card>

        <Card className="space-y-5 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Sort order" hint="Lower shows first">
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
            {isEdit ? 'Save changes' : 'Create series'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/series')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
