import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { seriesApi, categoriesApi } from '../../lib/api';
import { Button, Card, Badge, Select, Spinner, EmptyState } from '../components/ui';

export default function Series() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category') || '';

  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const [s, c] = await Promise.all([seriesApi.list(), categoriesApi.list()]);
      setSeries(s);
      setCategories(c);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () => (categoryFilter ? series.filter((s) => s.category_id === categoryFilter) : series),
    [series, categoryFilter]
  );

  const setCategoryFilter = (id) => {
    const next = new URLSearchParams(searchParams);
    if (id) next.set('category', id);
    else next.delete('category');
    setSearchParams(next, { replace: true });
  };

  const handleDelete = async (s) => {
    if (!confirm(`Delete "${s.name}"? Products in it will be left without a series.`)) return;
    setDeleting(s.id);
    try {
      await seriesApi.remove(s.id);
      setSeries((prev) => prev.filter((x) => x.id !== s.id));
    } catch (e) {
      alert(e.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Series</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Series are sub-categories that live inside a category. Products can belong to one.
          </p>
        </div>
        <Button onClick={() => navigate(`/admin/series/new${categoryFilter ? `?category=${categoryFilter}` : ''}`)}>
          <Plus size={16} /> Add series
        </Button>
      </div>

      <div className="mb-4 max-w-xs">
        <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-7 w-7" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No series yet"
          subtitle="Create a series to group products inside a category."
          action={
            <Button onClick={() => navigate(`/admin/series/new${categoryFilter ? `?category=${categoryFilter}` : ''}`)}>
              <Plus size={16} /> Add series
            </Button>
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 text-left text-xs uppercase tracking-wide text-neutral-400">
                <th className="px-5 py-3 font-medium">Image</th>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-neutral-50/60">
                  <td className="px-5 py-3">
                    <div className="h-11 w-11 overflow-hidden rounded-md border border-neutral-200 bg-neutral-50">
                      {s.image && <img src={s.image} alt="" className="h-full w-full object-cover" />}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="font-medium text-neutral-900">{s.name}</div>
                    <div className="text-xs text-neutral-400">/{s.slug}</div>
                  </td>
                  <td className="px-5 py-3 text-neutral-600">{s.category?.name || '—'}</td>
                  <td className="px-5 py-3">
                    {s.is_active ? <Badge color="green">Active</Badge> : <Badge color="red">Hidden</Badge>}
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1 text-neutral-500">
                      <GripVertical size={13} className="text-neutral-300" /> {s.sort_order}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/admin/series/${s.id}`}
                        className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(s)}
                        disabled={deleting === s.id}
                        className="rounded-md p-2 text-neutral-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
