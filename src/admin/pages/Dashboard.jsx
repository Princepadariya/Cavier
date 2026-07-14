import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, FolderTree, Newspaper, Mail, ArrowRight } from 'lucide-react';
import { categoriesApi, productsApi, blogsApi, contactApi } from '../../lib/api';
import { Card, Spinner } from '../components/ui';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [categories, products, blogs, contacts] = await Promise.all([
          categoriesApi.list(),
          productsApi.list(),
          blogsApi.list(),
          contactApi.list(),
        ]);
        setStats({
          categories: categories.length,
          products: products.length,
          blogs: blogs.length,
          unread: contacts.filter((c) => !c.is_read).length,
          contacts: contacts.length,
        });
        setRecent(contacts.slice(0, 5));
      } catch (e) {
        console.error(e);
        setStats({ categories: 0, products: 0, blogs: 0, unread: 0, contacts: 0 });
        setError('Could not load data. Have you run supabase/schema.sql yet?');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-7 w-7" />
      </div>
    );
  }

  const cards = [
    { label: 'Categories', value: stats.categories, icon: FolderTree, to: '/admin/categories' },
    { label: 'Products', value: stats.products, icon: Package, to: '/admin/products' },
    { label: 'Blog Posts', value: stats.blogs, icon: Newspaper, to: '/admin/blogs' },
    { label: 'Unread Messages', value: stats.unread, icon: Mail, to: '/admin/contact' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-500">Overview of your store content.</p>

      {error && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, to }) => (
          <Link key={label} to={to}>
            <Card className="p-5 transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">{label}</span>
                <Icon size={18} className="text-neutral-400" />
              </div>
              <div className="mt-3 text-3xl font-semibold">{value}</div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent messages</h2>
          <Link to="/admin/contact" className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <Card>
          {recent.length === 0 ? (
            <div className="p-8 text-center text-sm text-neutral-400">No messages yet.</div>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {recent.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {c.name} {!c.is_read && <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-neutral-900 align-middle" />}
                    </p>
                    <p className="truncate text-xs text-neutral-400">{c.subject || c.message}</p>
                  </div>
                  <span className="shrink-0 text-xs text-neutral-400">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
