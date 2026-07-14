import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { productsApi, categoriesApi } from '../../lib/api';
import { Button, Card, Badge, Spinner, EmptyState, Input, Select } from '../components/ui';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([productsApi.list(), categoriesApi.list()]);
      setProducts(prods);
      setCategories(cats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        (p.code || '').toLowerCase().includes(query.toLowerCase());
      const matchesCat = !catFilter || p.category_id === catFilter;
      return matchesQuery && matchesCat;
    });
  }, [products, query, catFilter]);

  const handleDelete = async (p) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    setDeleting(p.id);
    try {
      await productsApi.remove(p.id);
      setProducts((prev) => prev.filter((x) => x.id !== p.id));
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
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-neutral-500">{products.length} products in your catalog.</p>
        </div>
        <Button onClick={() => navigate('/admin/products/new')}>
          <Plus size={16} /> Add product
        </Button>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or code…"
            className="pl-9"
          />
        </div>
        <Select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="sm:w-56">
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
          title={products.length === 0 ? 'No products yet' : 'No matches'}
          subtitle={products.length === 0 ? 'Add your first product to the catalog.' : 'Try a different search or filter.'}
          action={
            products.length === 0 && (
              <Button onClick={() => navigate('/admin/products/new')}>
                <Plus size={16} /> Add product
              </Button>
            )
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
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50/60">
                  <td className="px-5 py-3">
                    <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-neutral-50">
                      {p.main_image && <img src={p.main_image} alt="" className="h-full w-full object-contain" />}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="font-medium text-neutral-900">{p.name}</div>
                    {p.code && <div className="text-xs text-neutral-400">{p.code}</div>}
                  </td>
                  <td className="px-5 py-3 text-neutral-600">{p.category?.name || <span className="text-neutral-300">—</span>}</td>
                  <td className="px-5 py-3 text-neutral-600">₹{Number(p.price).toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3">
                    {p.is_active ? <Badge color="green">Active</Badge> : <Badge color="red">Hidden</Badge>}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/admin/products/${p.id}`}
                        className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(p)}
                        disabled={deleting === p.id}
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
