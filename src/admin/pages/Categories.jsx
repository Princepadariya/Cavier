import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, GripVertical, Layers } from 'lucide-react';
import { categoriesApi } from '../../lib/api';
import { Button, Card, Badge, Spinner, EmptyState } from '../components/ui';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      setCategories(await categoriesApi.list());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (cat) => {
    if (!confirm(`Delete "${cat.name}"? Products in it will be left uncategorised.`)) return;
    setDeleting(cat.id);
    try {
      await categoriesApi.remove(cat.id);
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
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
          <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Categories power the home rows, the product filters and the category page.
          </p>
        </div>
        <Button onClick={() => navigate('/admin/categories/new')}>
          <Plus size={16} /> Add category
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-7 w-7" />
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          title="No categories yet"
          subtitle="Create your first category to start organising products."
          action={
            <Button onClick={() => navigate('/admin/categories/new')}>
              <Plus size={16} /> Add category
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
                <th className="px-5 py-3 font-medium">On home</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50/60">
                  <td className="px-5 py-3">
                    <div className="h-11 w-11 overflow-hidden rounded-md border border-neutral-200 bg-neutral-50">
                      {c.card_image && <img src={c.card_image} alt="" className="h-full w-full object-cover" />}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="font-medium text-neutral-900">{c.name}</div>
                    <div className="text-xs text-neutral-400">/{c.slug}</div>
                  </td>
                  <td className="px-5 py-3">
                    {c.show_on_home ? <Badge color="green">Featured</Badge> : <span className="text-neutral-300">—</span>}
                  </td>
                  <td className="px-5 py-3">
                    {c.is_active ? <Badge color="green">Active</Badge> : <Badge color="red">Hidden</Badge>}
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1 text-neutral-500">
                      <GripVertical size={13} className="text-neutral-300" /> {c.sort_order}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/admin/series?category=${c.id}`}
                        title="Manage series"
                        className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                      >
                        <Layers size={15} />
                      </Link>
                      <Link
                        to={`/admin/categories/${c.id}`}
                        className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(c)}
                        disabled={deleting === c.id}
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
