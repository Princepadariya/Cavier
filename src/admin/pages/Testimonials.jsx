import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { testimonialsApi } from '../../lib/api';
import { Button, Card, Badge, Spinner, EmptyState } from '../components/ui';

export default function Testimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      setItems(await testimonialsApi.list());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (t) => {
    if (!confirm(`Delete testimonial from "${t.name}"?`)) return;
    setDeleting(t.id);
    try {
      await testimonialsApi.remove(t.id);
      setItems((prev) => prev.filter((x) => x.id !== t.id));
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
          <h1 className="text-2xl font-semibold tracking-tight">Testimonials</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {items.length} testimonials. Shown in the "Experiences That Speak for Quality" section on the home page.
          </p>
        </div>
        <Button onClick={() => navigate('/admin/testimonials/new')}>
          <Plus size={16} /> Add testimonial
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-7 w-7" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No testimonials yet"
          subtitle="Add your first customer testimonial."
          action={
            <Button onClick={() => navigate('/admin/testimonials/new')}>
              <Plus size={16} /> Add testimonial
            </Button>
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 text-left text-xs uppercase tracking-wide text-neutral-400">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Quote</th>
                <th className="px-5 py-3 font-medium">Rating</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {items.map((t) => (
                <tr key={t.id} className="hover:bg-neutral-50/60">
                  <td className="px-5 py-3 font-medium text-neutral-900 whitespace-nowrap">{t.name}</td>
                  <td className="px-5 py-3 text-neutral-500 whitespace-nowrap">{t.role}</td>
                  <td className="px-5 py-3">
                    <div className="max-w-sm truncate text-neutral-600">{t.quote}</div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} fill={i < t.rating ? 'currentColor' : 'none'} strokeWidth={1.5} />
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    {t.is_active ? <Badge color="green">Active</Badge> : <Badge color="neutral">Hidden</Badge>}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/admin/testimonials/${t.id}`}
                        className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(t)}
                        disabled={deleting === t.id}
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
