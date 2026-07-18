import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Plus, X, ChevronUp, ChevronDown, Heading, Pilcrow, Image as ImageIcon } from 'lucide-react';
import { blogsApi, slugify, uploadImage } from '../../lib/api';
import { Button, Card, Field, Input, Textarea, Toggle, Spinner } from '../components/ui';
import { ImageUpload } from '../components/ImageUpload';

const empty = {
  title: '',
  slug: '',
  author: 'By Cavier India',
  read_time: '4 min read',
  header_image: '',
  excerpt: '',
  content: [],
  is_published: true,
  published_at: '',
};

// Content block editor — an ordered list of heading / paragraph / image blocks.
function BlockEditor({ blocks, onChange }) {
  const update = (i, patch) => onChange(blocks.map((b, idx) => (idx === i ? { ...b, ...patch } : b)));
  const remove = (i) => onChange(blocks.filter((_, idx) => idx !== i));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const add = (type) =>
    onChange([...blocks, type === 'image' ? { type, url: '' } : { type, text: '' }]);

  const uploadBlockImage = async (i, file) => {
    if (!file) return;
    try {
      const url = await uploadImage(file, 'blogs');
      update(i, { url });
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-3">
      {blocks.map((b, i) => (
        <div key={i} className="rounded-lg border border-neutral-200 bg-neutral-50/50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-neutral-400">
              {b.type === 'heading' && <Heading size={13} />}
              {b.type === 'paragraph' && <Pilcrow size={13} />}
              {b.type === 'image' && <ImageIcon size={13} />}
              {b.type}
            </span>
            <div className="flex items-center gap-0.5">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-1 text-neutral-400 hover:bg-neutral-200 disabled:opacity-30">
                <ChevronUp size={15} />
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === blocks.length - 1} className="rounded p-1 text-neutral-400 hover:bg-neutral-200 disabled:opacity-30">
                <ChevronDown size={15} />
              </button>
              <button type="button" onClick={() => remove(i)} className="rounded p-1 text-neutral-400 hover:bg-red-50 hover:text-red-600">
                <X size={15} />
              </button>
            </div>
          </div>

          {b.type === 'heading' && (
            <Input value={b.text} onChange={(e) => update(i, { text: e.target.value })} placeholder="Section heading" className="bg-white font-semibold" />
          )}
          {b.type === 'paragraph' && (
            <Textarea rows={4} value={b.text} onChange={(e) => update(i, { text: e.target.value })} placeholder="Paragraph text…" className="bg-white" />
          )}
          {b.type === 'image' && (
            <div className="flex items-center gap-3">
              <div className="h-24 w-32 shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-white">
                {b.url && <img src={b.url} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => uploadBlockImage(i, e.target.files?.[0])}
                  className="block w-full text-xs text-neutral-500 file:mr-3 file:rounded-md file:border-0 file:bg-neutral-900 file:px-3 file:py-1.5 file:text-xs file:text-white"
                />
                <Input value={b.url} onChange={(e) => update(i, { url: e.target.value })} placeholder="…or paste image URL" className="mt-2 bg-white text-xs" />
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={() => add('heading')} className="text-xs">
          <Heading size={14} /> Heading
        </Button>
        <Button type="button" variant="outline" onClick={() => add('paragraph')} className="text-xs">
          <Pilcrow size={14} /> Paragraph
        </Button>
        <Button type="button" variant="outline" onClick={() => add('image')} className="text-xs">
          <ImageIcon size={14} /> Image
        </Button>
      </div>
    </div>
  );
}

export default function BlogForm() {
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
        const b = await blogsApi.get(id);
        if (b) {
          let formattedDate = '';
          if (b.published_at) {
            formattedDate = new Date(b.published_at).toISOString().split('T')[0];
          }
          setForm({ ...empty, ...b, content: b.content || [], published_at: formattedDate });
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

  const onTitleChange = (v) => {
    set('title', v);
    if (!slugTouched) set('slug', slugify(v));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      author: form.author,
      read_time: form.read_time,
      header_image: form.header_image || null,
      excerpt: form.excerpt,
      content: form.content,
      is_published: form.is_published,
    };
    if (form.published_at) {
      payload.published_at = new Date(form.published_at).toISOString();
    }
    try {
      if (isEdit) await blogsApi.update(id, payload);
      else await blogsApi.create(payload);
      navigate('/admin/blogs');
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
      <Link to="/admin/blogs" className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900">
        <ArrowLeft size={15} /> Blog Posts
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">{isEdit ? 'Edit post' : 'New post'}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <Card className="space-y-5 p-6">
          <Field label="Title" required>
            <Input value={form.title} onChange={(e) => onTitleChange(e.target.value)} required placeholder="The Future of Premium Bath Fittings" />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Slug">
              <Input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set('slug', slugify(e.target.value));
                }}
              />
            </Field>
            <Field label="Read time">
              <Input value={form.read_time} onChange={(e) => set('read_time', e.target.value)} placeholder="4 min read" />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Author">
              <Input value={form.author} onChange={(e) => set('author', e.target.value)} />
            </Field>
            <Field label="Publish Date" hint="Leave empty to use current date">
              <Input type="date" value={form.published_at} onChange={(e) => set('published_at', e.target.value)} />
            </Field>
          </div>
          <Field label="Excerpt / intro" hint="Shown on the blog card and at the top of the article.">
            <Textarea rows={3} value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} />
          </Field>
        </Card>

        <Card className="p-6">
          <ImageUpload
            label="Cover / header image"
            folder="blogs"
            aspect="aspect-[21/9]"
            value={form.header_image}
            onChange={(url) => set('header_image', url)}
          />
        </Card>

        <Card className="space-y-4 p-6">
          <h2 className="text-sm font-semibold text-neutral-700">Content</h2>
          <BlockEditor blocks={form.content} onChange={(blocks) => set('content', blocks)} />
        </Card>

        <Card className="p-6">
          <Toggle checked={form.is_published} onChange={(v) => set('is_published', v)} label="Published (visible on site)" />
        </Card>

        {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 size={16} className="animate-spin" />}
            {isEdit ? 'Save changes' : 'Create post'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/blogs')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
