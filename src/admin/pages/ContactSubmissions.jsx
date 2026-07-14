import React, { useEffect, useState } from 'react';
import { Mail, Trash2, Check, Phone, Briefcase } from 'lucide-react';
import { contactApi } from '../../lib/api';
import { Card, Badge, Spinner, EmptyState, Button } from '../components/ui';

export default function ContactSubmissions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await contactApi.list());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const open = async (item) => {
    setSelected(item);
    if (!item.is_read) {
      try {
        await contactApi.markRead(item.id, true);
        setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, is_read: true } : x)));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleDelete = async (item) => {
    if (!confirm('Delete this message?')) return;
    try {
      await contactApi.remove(item.id);
      setItems((prev) => prev.filter((x) => x.id !== item.id));
      if (selected?.id === item.id) setSelected(null);
    } catch (e) {
      alert(e.message);
    }
  };

  const unread = items.filter((i) => !i.is_read).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Contact Submissions</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {items.length} total{unread > 0 && ` · ${unread} unread`}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-7 w-7" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState title="No messages yet" subtitle="Submissions from the contact form will appear here." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* List */}
          <Card className="divide-y divide-neutral-100 overflow-hidden">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => open(item)}
                className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-neutral-50 ${
                  selected?.id === item.id ? 'bg-neutral-50' : ''
                }`}
              >
                <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${item.is_read ? 'bg-transparent' : 'bg-neutral-900'}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`truncate text-sm ${item.is_read ? 'font-medium text-neutral-700' : 'font-semibold text-neutral-900'}`}>
                      {item.name}
                    </span>
                    <span className="shrink-0 text-xs text-neutral-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="truncate text-xs text-neutral-500">{item.subject || 'No subject'}</p>
                  <p className="mt-0.5 truncate text-xs text-neutral-400">{item.message}</p>
                </div>
              </button>
            ))}
          </Card>

          {/* Detail */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            {selected ? (
              <Card className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{selected.name}</h2>
                    <a href={`mailto:${selected.email}`} className="text-sm text-neutral-500 hover:text-neutral-900">
                      {selected.email}
                    </a>
                  </div>
                  {selected.is_read && <Badge color="neutral">Read</Badge>}
                </div>

                <div className="mb-4 flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-neutral-600">
                  {selected.contact && (
                    <span className="inline-flex items-center gap-1.5">
                      <Phone size={14} className="text-neutral-400" /> {selected.contact}
                    </span>
                  )}
                  {selected.designation && (
                    <span className="inline-flex items-center gap-1.5">
                      <Briefcase size={14} className="text-neutral-400" /> {selected.designation}
                    </span>
                  )}
                </div>

                {selected.subject && (
                  <div className="mb-2 text-sm font-medium text-neutral-800">{selected.subject}</div>
                )}
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">{selected.message}</p>

                <div className="mt-6 flex items-center gap-3 border-t border-neutral-100 pt-4">
                  <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || 'Your enquiry')}`}>
                    <Button variant="secondary">
                      <Mail size={15} /> Reply
                    </Button>
                  </a>
                  <Button variant="ghost" onClick={() => handleDelete(selected)} className="text-red-600 hover:bg-red-50">
                    <Trash2 size={15} /> Delete
                  </Button>
                  <span className="ml-auto text-xs text-neutral-400">
                    {new Date(selected.created_at).toLocaleString()}
                  </span>
                </div>
              </Card>
            ) : (
              <Card className="flex flex-col items-center justify-center py-16 text-center text-neutral-400">
                <Mail size={28} />
                <p className="mt-3 text-sm">Select a message to read</p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
