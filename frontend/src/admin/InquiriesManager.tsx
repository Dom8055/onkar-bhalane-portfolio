import React, { useEffect, useState } from 'react';
import { Download, MailOpen, Mail, Search, Trash2 } from 'lucide-react';
import { adminApi } from '../services/api';
import type { ContactInquiry } from '../types/portfolio';

export const InquiriesManager: React.FC = () => {
  const [messages, setMessages] = useState<ContactInquiry[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ContactInquiry | null>(null);
  const [notes, setNotes] = useState('');

  const load = () => adminApi.listMessages({ status: statusFilter, search }).then(setMessages);

  useEffect(() => {
    load();
  }, [statusFilter, search]);

  const openMessage = async (msg: ContactInquiry) => {
    setSelected(msg);
    setNotes(msg.internal_notes || '');
    if (!msg.is_read) {
      const updated = await adminApi.updateMessage(msg.id, { is_read: true });
      setSelected(updated);
      await load();
    }
  };

  const updateSelected = async (patch: Partial<Pick<ContactInquiry, 'is_read' | 'status' | 'internal_notes'>>) => {
    if (!selected) return;
    const updated = await adminApi.updateMessage(selected.id, patch);
    setSelected(updated);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ivory">Contact Inquiries</h1>
          <p className="text-sm text-slateMuted">Review messages, track status, add private notes, and export to CSV.</p>
        </div>
        <button
          onClick={() => adminApi.exportMessagesCsv()}
          className="inline-flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-2.5 text-xs font-semibold text-gold-light hover:bg-gold/20"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, subject..."
            className="w-full rounded-xl border border-white/10 bg-surface py-2.5 pl-10 pr-4 text-sm text-ivory outline-none focus:border-gold"
          />
        </div>
        {['all', 'new', 'in_progress', 'replied', 'archived'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`rounded-xl px-3.5 py-2 text-xs uppercase ${
              statusFilter === st ? 'bg-gold font-semibold text-obsidian' : 'border border-white/10 text-slateMuted'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* List */}
        <div className="space-y-3 lg:col-span-5">
          {messages.length === 0 ? (
            <div className="glass-panel rounded-2xl p-8 text-center text-sm text-slateMuted">No inquiries found.</div>
          ) : (
            messages.map((m) => (
              <button
                key={m.id}
                onClick={() => openMessage(m)}
                className={`glass-panel w-full rounded-2xl p-4 text-left transition-colors ${
                  selected?.id === m.id ? 'border-gold' : 'hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm font-semibold text-ivory">
                    {m.is_read ? <MailOpen className="h-3.5 w-3.5 text-slateMuted" /> : <Mail className="h-3.5 w-3.5 text-gold-light" />}
                    {m.name}
                  </span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] uppercase text-gold-light">
                    {m.status}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-gold-light">{m.subject}</p>
                <p className="mt-1 line-clamp-2 text-xs text-slateMuted">{m.message}</p>
              </button>
            ))
          )}
        </div>

        {/* Detail Pane */}
        <div className="lg:col-span-7">
          {selected ? (
            <div className="glass-panel rounded-2xl p-6 space-y-5">
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-ivory">{selected.subject}</h2>
                  <p className="mt-1 text-xs text-slateMuted">
                    From <span className="text-ivory">{selected.name}</span> ({selected.email}) ·{' '}
                    {new Date(selected.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={async () => {
                    if (window.confirm('Delete this inquiry?')) {
                      await adminApi.deleteMessage(selected.id);
                      setSelected(null);
                      await load();
                    }
                  }}
                  className="rounded-lg border border-rose-500/20 p-2 text-rose-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="rounded-xl bg-obsidian/80 p-4 text-sm leading-relaxed text-ivory whitespace-pre-wrap">
                {selected.message}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs uppercase text-slateMuted">Status</label>
                  <select
                    value={selected.status}
                    onChange={(e) => updateSelected({ status: e.target.value as ContactInquiry['status'] })}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2 text-sm text-ivory"
                  >
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => updateSelected({ is_read: !selected.is_read })}
                    className="w-full rounded-xl border border-white/10 bg-obsidian px-4 py-2 text-xs text-ivory hover:border-gold"
                  >
                    Mark as {selected.is_read ? 'Unread' : 'Read'}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase text-slateMuted">Internal Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
                />
                <button
                  onClick={() => updateSelected({ internal_notes: notes })}
                  className="mt-2 rounded-xl bg-gold px-4 py-2 text-xs font-semibold text-obsidian"
                >
                  Save Notes
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel flex h-64 items-center justify-center rounded-2xl text-sm text-slateMuted">
              Select an inquiry to view details and internal notes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
