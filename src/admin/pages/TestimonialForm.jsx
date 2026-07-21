import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Star } from 'lucide-react';
import { testimonialsApi } from '../../lib/api';
import { Button, Card, Field, Input, Textarea, Toggle, Spinner } from '../components/ui';

const empty = {
  name: '',
  role: '',
  quote: '',
  rating: 5,
  is_active: true,
  sort_order: 0,
};

function RatingInput({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="text-amber-500 transition-transform hover:scale-110"
        >
          <Star size={22} fill={n <= value ? 'currentColor' : 'none'} strokeWidth={1.5} />
        </button>
      ))}
      <span className="ml-2 text-sm text-neutral-400">{value} / 5</span>
    </div>
  );
}

export default function TestimonialForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const t = await testimonialsApi.get(id);
        if (t) setForm({ ...empty, ...t });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      role: form.role.trim(),
      quote: form.quote.trim(),
      rating: Number(form.rating),
      is_active: form.is_active,
      sort_order: Number(form.sort_order) || 0,
    };
    try {
      if (isEdit) await testimonialsApi.update(id, payload);
      else await testimonialsApi.create(payload);
      navigate('/admin/testimonials');
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
    <div className="max-w-2xl">
      <Link to="/admin/testimonials" className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900">
        <ArrowLeft size={15} /> Testimonials
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">{isEdit ? 'Edit testimonial' : 'New testimonial'}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <Card className="space-y-5 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" required>
              <Input value={form.name} onChange={(e) => set('name', e.target.value)} required placeholder="James Walker" />
            </Field>
            <Field label="Role" hint="e.g. Distributor, Architect, Hotel Manager">
              <Input value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="Distributor" />
            </Field>
          </div>

          <Field label="Quote" required>
            <Textarea
              rows={4}
              value={form.quote}
              onChange={(e) => set('quote', e.target.value)}
              required
              placeholder="Cavier products have exceeded our expectations..."
            />
          </Field>

          <Field label="Rating">
            <RatingInput value={form.rating} onChange={(v) => set('rating', v)} />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Sort order" hint="Lower numbers appear first.">
              <Input type="number" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} />
            </Field>
          </div>
        </Card>

        <Card className="p-6">
          <Toggle checked={form.is_active} onChange={(v) => set('is_active', v)} label="Active (visible on site)" />
        </Card>

        {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 size={16} className="animate-spin" />}
            {isEdit ? 'Save changes' : 'Create testimonial'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/testimonials')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
