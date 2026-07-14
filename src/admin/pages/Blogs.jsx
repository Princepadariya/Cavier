import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { blogsApi } from '../../lib/api';
import { Button, Card, Badge, Spinner, EmptyState } from '../components/ui';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      setBlogs(await blogsApi.list());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (b) => {
    if (!confirm(`Delete "${b.title}"?`)) return;
    setDeleting(b.id);
    try {
      await blogsApi.remove(b.id);
      setBlogs((prev) => prev.filter((x) => x.id !== b.id));
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
          <h1 className="text-2xl font-semibold tracking-tight">Blog Posts</h1>
          <p className="mt-1 text-sm text-neutral-500">{blogs.length} posts.</p>
        </div>
        <Button onClick={() => navigate('/admin/blogs/new')}>
          <Plus size={16} /> Add post
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-7 w-7" />
        </div>
      ) : blogs.length === 0 ? (
        <EmptyState
          title="No blog posts yet"
          subtitle="Write your first post."
          action={
            <Button onClick={() => navigate('/admin/blogs/new')}>
              <Plus size={16} /> Add post
            </Button>
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 text-left text-xs uppercase tracking-wide text-neutral-400">
                <th className="px-5 py-3 font-medium">Cover</th>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {blogs.map((b) => (
                <tr key={b.id} className="hover:bg-neutral-50/60">
                  <td className="px-5 py-3">
                    <div className="h-11 w-16 overflow-hidden rounded-md border border-neutral-200 bg-neutral-50">
                      {b.header_image && <img src={b.header_image} alt="" className="h-full w-full object-cover" />}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="max-w-md truncate font-medium text-neutral-900">{b.title}</div>
                    <div className="text-xs text-neutral-400">/{b.slug}</div>
                  </td>
                  <td className="px-5 py-3">
                    {b.is_published ? <Badge color="green">Published</Badge> : <Badge color="amber">Draft</Badge>}
                  </td>
                  <td className="px-5 py-3 text-neutral-500">{new Date(b.published_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/admin/blogs/${b.id}`}
                        className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(b)}
                        disabled={deleting === b.id}
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
