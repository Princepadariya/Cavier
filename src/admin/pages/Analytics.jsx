import React, { useEffect, useState } from 'react';
import { Eye, Loader2 } from 'lucide-react';
import { settingsApi, productsApi } from '../../lib/api';
import { Card, Badge, Toggle, Spinner } from '../components/ui';

export default function Analytics() {
  const [settings, setSettings] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingToggle, setSavingToggle] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [s, top] = await Promise.all([
        settingsApi.get(),
        productsApi.topViewed({ limit: 20 }),
      ]);
      setSettings(s);
      setProducts(top);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleBestsellers = async (checked) => {
    setSavingToggle(true);
    try {
      const updated = await settingsApi.update({ bestseller_auto_enabled: checked });
      setSettings(updated);
    } catch (e) {
      alert(e.message);
    } finally {
      setSavingToggle(false);
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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Bestseller Analytics</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Every time a visitor opens a product page, its view count goes up. The most-viewed
          products can be shown automatically on the homepage.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error} — have you run the latest supabase/schema.sql yet?
        </div>
      )}

      <Card className="mb-6 flex items-center justify-between p-6">
        <div>
          <p className="text-sm font-semibold text-neutral-800">Automatic Bestsellers section</p>
          <p className="mt-1 text-xs text-neutral-500">
            When on, the homepage shows a "Bestsellers" row built from the most-viewed active
            products — no manual curation needed.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {savingToggle && <Loader2 size={16} className="animate-spin text-neutral-400" />}
          <Toggle
            checked={Boolean(settings?.bestseller_auto_enabled)}
            onChange={toggleBestsellers}
            label={settings?.bestseller_auto_enabled ? 'On' : 'Off'}
          />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3">
          <h2 className="text-sm font-semibold text-neutral-700">Most viewed products</h2>
          <span className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Eye size={13} /> View count
          </span>
        </div>
        {products.length === 0 ? (
          <div className="p-8 text-center text-sm text-neutral-400">
            No views yet. Counts appear once visitors open product pages.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 text-left text-xs uppercase tracking-wide text-neutral-400">
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Views</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50/60">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-neutral-50">
                        {p.main_image && <img src={p.main_image} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <span className="font-medium text-neutral-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-neutral-600">{p.category?.name || '—'}</td>
                  <td className="px-5 py-3">
                    {p.is_active ? <Badge color="green">Active</Badge> : <Badge color="red">Hidden</Badge>}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-neutral-900">{p.view_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
