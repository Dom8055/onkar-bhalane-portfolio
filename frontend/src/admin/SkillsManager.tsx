import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Pencil, Plus, Trash2, X } from 'lucide-react';
import { adminApi } from '../services/api';
import type { Skill } from '../types/portfolio';

const CATEGORIES = [
  'Programming Languages',
  'Mobile Application Development',
  'State Management',
  'Backend & API Integration',
  'Firebase Services',
  'Third-Party SDKs',
  'Authentication & Verification',
  'Web Technologies',
  'Tools & Deployment',
  'Performance Optimization',
];

export const SkillsManager: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [filterCat, setFilterCat] = useState('All');
  const [editing, setEditing] = useState<Partial<Skill> | null>(null);

  const load = () => adminApi.listSkills().then(setSkills);
  useEffect(() => {
    load();
  }, []);

  const visible = filterCat === 'All' ? skills : skills.filter((s) => s.category === filterCat);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (editing.id) {
      await adminApi.updateSkill(editing.id, editing);
    } else {
      await adminApi.createSkill(editing);
    }
    setEditing(null);
    await load();
  };

  const handleDelete = async (s: Skill) => {
    if (!window.confirm(`Delete skill "${s.name}"?`)) return;
    await adminApi.deleteSkill(s.id);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ivory">Skills Management</h1>
          <p className="text-sm text-slateMuted">Manage skills by category, ordering, visibility, and optional proficiency.</p>
        </div>
        <button
          onClick={() =>
            setEditing({ name: '', category: CATEGORIES[0], icon_name: 'code', is_visible: true, order: 1 })
          }
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-semibold text-obsidian"
        >
          <Plus className="h-4 w-4" />
          Add Skill
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {['All', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`rounded-full px-3.5 py-1.5 text-xs ${
              filterCat === cat ? 'bg-gold text-obsidian font-semibold' : 'border border-white/10 text-slateMuted'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((s) => (
          <div key={s.id} className="glass-panel flex items-center justify-between rounded-xl p-4">
            <div>
              <p className="text-sm font-semibold text-ivory">{s.name}</p>
              <p className="text-[11px] text-gold-light">{s.category}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={async () => {
                  await adminApi.updateSkill(s.id, { is_visible: !s.is_visible });
                  await load();
                }}
                className="rounded-lg p-1.5 text-slateMuted hover:text-ivory"
                title="Toggle visibility"
              >
                {s.is_visible ? <Eye className="h-3.5 w-3.5 text-emerald-400" /> : <EyeOff className="h-3.5 w-3.5" />}
              </button>
              <button onClick={() => setEditing(s)} className="rounded-lg p-1.5 text-slateMuted hover:text-ivory">
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => handleDelete(s)} className="rounded-lg p-1.5 text-rose-400 hover:bg-rose-500/10">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <form onSubmit={handleSave} className="glass-panel-gold w-full max-w-md space-y-4 rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-ivory">{editing.id ? 'Edit Skill' : 'Add Skill'}</h2>
              <button type="button" onClick={() => setEditing(null)}>
                <X className="h-5 w-5 text-slateMuted" />
              </button>
            </div>
            <div>
              <label className="text-xs uppercase text-slateMuted">Skill Name *</label>
              <input
                required
                value={editing.name || ''}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
              />
            </div>
            <div>
              <label className="text-xs uppercase text-slateMuted">Category *</label>
              <select
                value={editing.category || CATEGORIES[0]}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                className="mt-1 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs uppercase text-slateMuted">Order</label>
                <input
                  type="number"
                  value={editing.order || 0}
                  onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-slateMuted">Optional Level (0-100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={editing.proficiency_level ?? ''}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      proficiency_level: e.target.value === '' ? null : Number(e.target.value),
                    })
                  }
                  placeholder="Leave blank"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="rounded-xl border border-white/10 px-4 py-2 text-xs text-slateMuted">
                Cancel
              </button>
              <button type="submit" className="rounded-xl bg-gold px-5 py-2 text-xs font-semibold text-obsidian">
                Save Skill
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
