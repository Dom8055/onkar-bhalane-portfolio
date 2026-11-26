import React, { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { adminApi } from '../services/api';
import type { Achievement } from '../types/portfolio';

export const AchievementsManager: React.FC = () => {
  const [items, setItems] = useState<Achievement[]>([]);
  const [editing, setEditing] = useState<Partial<Achievement> | null>(null);

  const load = () => adminApi.listAchievements().then(setItems);
  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (editing.id) {
      await adminApi.updateAchievement(editing.id, editing);
    } else {
      await adminApi.createAchievement(editing);
    }
    setEditing(null);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ivory">Achievements Management</h1>
          <p className="text-sm text-slateMuted">Add, edit, publish, and reorder portfolio highlights.</p>
        </div>
        <button
          onClick={() => setEditing({ badge: '10+', title: '', description: '', is_published: true, order: items.length + 1 })}
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-semibold text-[#080B12]"
        >
          <Plus className="h-4 w-4" />
          Add Achievement
        </button>
      </div>

      <div className="space-y-3">
        {items.map((a) => (
          <div key={a.id} className="glass-panel flex items-start justify-between gap-4 rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/40 bg-obsidian font-display font-bold text-gold-light">
                {a.badge}
              </div>
              <div>
                <p className="font-display text-base font-bold text-ivory">{a.title}</p>
                <p className="mt-1 text-xs text-slateMuted">{a.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(a)} className="rounded-lg border border-hairline p-2 text-slateMuted hover:text-ivory">
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={async () => {
                  if (window.confirm(`Delete achievement "${a.title}"?`)) {
                    await adminApi.deleteAchievement(a.id);
                    await load();
                  }
                }}
                className="rounded-lg border border-rose-500/20 p-2 text-rose-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <form onSubmit={handleSave} className="glass-panel-gold w-full max-w-md space-y-4 rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-ivory">{editing.id ? 'Edit Achievement' : 'Add Achievement'}</h2>
              <button type="button" onClick={() => setEditing(null)}>
                <X className="h-5 w-5 text-slateMuted" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs uppercase text-slateMuted">Badge *</label>
                <input required value={editing.badge || ''} onChange={(e) => setEditing({ ...editing, badge: e.target.value })} placeholder="10+" className="mt-1 w-full rounded-xl border border-hairline bg-obsidian px-3.5 py-2.5 text-sm text-ivory" />
              </div>
              <div className="col-span-2">
                <label className="text-xs uppercase text-slateMuted">Title *</label>
                <input required value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="mt-1 w-full rounded-xl border border-hairline bg-obsidian px-3.5 py-2.5 text-sm text-ivory" />
              </div>
            </div>
            <div>
              <label className="text-xs uppercase text-slateMuted">Description *</label>
              <textarea required rows={3} value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="mt-1 w-full rounded-xl border border-hairline bg-obsidian px-3.5 py-2.5 text-sm text-ivory" />
            </div>
            <label className="flex items-center gap-2 text-sm text-ivory">
              <input type="checkbox" checked={Boolean(editing.is_published)} onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })} className="h-4 w-4 accent-[#B68B50]" />
              Published
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="rounded-xl border border-hairline px-4 py-2 text-xs text-slateMuted">Cancel</button>
              <button type="submit" className="rounded-xl bg-gold px-5 py-2 text-xs font-semibold text-[#080B12]">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
