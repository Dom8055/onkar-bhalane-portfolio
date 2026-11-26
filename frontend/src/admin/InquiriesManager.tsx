import React, { useEffect, useState } from 'react';
import { Download, Mail, MailOpen, Search, Trash2 } from 'lucide-react';
import { LiquidGlassDropdown, LiquidGlassPanel } from '../components/liquid-glass';
import { adminApi } from '../services/api';
import type { ContactInquiry } from '../types/portfolio';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'replied', label: 'Replied' },
  { value: 'archived', label: 'Archived' },
];

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
          className="liquid-glass inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2.5 text-xs font-semibold text-gold hover:bg-gold hover:text-[#080B12]"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Search + LiquidGlassDropdown Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, subject..."
            className="liquid-glass w-full rounded-full py-2.5 pl-11 pr-4 text-sm text-ivory outline-none focus:border-gold"
          />
        </div>
        <LiquidGlassDropdown
          label="Filter"
          value={statusFilter}
          options={STATUS_OPTIONS}
          onChange={setStatusFilter}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* List */}
        <div className="space-y-3 lg:col-span-5">
          {messages.length === 0 ? (
            <LiquidGlassPanel className="p-8 text-center text-sm text-slateMuted">No inquiries found.</LiquidGlassPanel>
          ) : (
            messages.map((m) => (
              <button
                key={m.id}
                onClick={() => openMessage(m)}
                className={`liquid-glass w-full rounded-2xl p-4 text-left transition-all ${
                  selected?.id === m.id ? 'border-gold' : 'hover:border-gold/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm font-semibold text-ivory">
                    {m.is_read ? <MailOpen className="h-3.5 w-3.5 text-slateMuted" /> : <Mail className="h-3.5 w-3.5 text-gold" />}
                    {m.name}
                  </span>
                  <span className="rounded-full border border-hairline px-2.5 py-0.5 font-mono text-[10px] uppercase text-gold">
                    {m.status}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs font-medium text-gold">{m.subject}</p>
                <p className="mt-1 line-clamp-2 text-xs text-slateMuted">{m.message}</p>
              </button>
            ))
          )}
        </div>

        {/* Detail Pane */}
        <div className="lg:col-span-7">
          {selected ? (
            <LiquidGlassPanel className="space-y-5 p-6">
              <div className="flex items-start justify-between gap-4 border-b border-hairline pb-4">
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
                  className="rounded-full border border-rose-500/30 p-2 text-rose-500 hover:bg-rose-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="whitespace-pre-wrap rounded-2xl border border-hairline bg-surface p-4 text-sm leading-relaxed text-ivory">
                {selected.message}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-slateMuted">Status</label>
                  <div className="mt-1.5">
                    <LiquidGlassDropdown
                      value={selected.status}
                      options={STATUS_OPTIONS.filter((o) => o.value !== 'all')}
                      onChange={(val) => updateSelected({ status: val as ContactInquiry['status'] })}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => updateSelected({ is_read: !selected.is_read })}
                    className="liquid-glass w-full rounded-full px-4 py-2.5 text-xs font-medium text-ivory hover:border-gold"
                  >
                    Mark as {selected.is_read ? 'Unread' : 'Read'}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-slateMuted">Internal Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1.5 w-full rounded-2xl border border-hairline bg-surface px-4 py-3 text-sm text-ivory outline-none focus:border-gold"
                />
                <button
                  onClick={() => updateSelected({ internal_notes: notes })}
                  className="mt-3 rounded-full bg-gradient-to-r from-gold to-gold-light px-5 py-2 text-xs font-semibold text-[#080B12]"
                >
                  Save Notes
                </button>
              </div>
            </LiquidGlassPanel>
          ) : (
            <LiquidGlassPanel className="flex h-64 items-center justify-center text-sm text-slateMuted">
              Select an inquiry to view details and internal notes.
            </LiquidGlassPanel>
          )}
        </div>
      </div>
    </div>
  );
};
