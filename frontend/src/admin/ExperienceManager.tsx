import React, { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { adminApi } from '../services/api';
import type { Experience } from '../types/portfolio';

export const ExperienceManager: React.FC = () => {
  const [items, setItems] = useState<Experience[]>([]);
  const [editing, setEditing] = useState<Partial<Experience> | null>(null);
  const [respText, setRespText] = useState('');
  const [techText, setTechText] = useState('');

  const load = () => adminApi.listExperience().then(setItems);
  useEffect(() => {
    load();
  }, []);

  const openEditor = (exp?: Experience) => {
    if (exp) {
      setEditing(exp);
      setRespText(exp.responsibilities.join('\n'));
      setTechText(exp.technologies.join(', '));
    } else {
      setEditing({ company: '', role: '', duration: '', location: 'Nagpur, India', is_current: false, order: items.length + 1, is_visible: true });
      setRespText('');
      setTechText('');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const payload = {
      ...editing,
      responsibilities: respText.split('\n').map((s) => s.trim()).filter(Boolean),
      technologies: techText.split(',').map((s) => s.trim()).filter(Boolean),
    };
    if (editing.id) {
      await adminApi.updateExperience(editing.id, payload);
    } else {
      await adminApi.createExperience(payload);
    }
    setEditing(null);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ivory">Experience Management</h1>
          <p className="text-sm text-slateMuted">Manage career timeline roles, responsibilities, and technologies.</p>
        </div>
        <button
          onClick={() => openEditor()}
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-semibold text-[#080B12]"
        >
          <Plus className="h-4 w-4" />
          Add Role
        </button>
      </div>

      <div className="space-y-4">
        {items.map((exp) => (
          <div key={exp.id} className="glass-panel flex items-start justify-between gap-4 rounded-2xl p-5">
            <div>
              <p className="font-display text-lg font-bold text-ivory">
                {exp.role} · <span className="text-gold-light">{exp.company}</span>
              </p>
              <p className="mt-1 text-xs text-slateMuted">
                {exp.duration} · {exp.location}
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slateMuted">
                {exp.responsibilities.slice(0, 3).map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEditor(exp)} className="rounded-lg border border-hairline p-2 text-slateMuted hover:text-ivory">
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={async () => {
                  if (window.confirm(`Delete experience at ${exp.company}?`)) {
                    await adminApi.deleteExperience(exp.id);
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
          <form onSubmit={handleSave} className="glass-panel-gold max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-ivory">{editing.id ? 'Edit Experience' : 'Add Experience'}</h2>
              <button type="button" onClick={() => setEditing(null)}>
                <X className="h-5 w-5 text-slateMuted" />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs uppercase text-slateMuted">Company *</label>
                <input required value={editing.company || ''} onChange={(e) => setEditing({ ...editing, company: e.target.value })} className="mt-1 w-full rounded-xl border border-hairline bg-obsidian px-3.5 py-2.5 text-sm text-ivory" />
              </div>
              <div>
                <label className="text-xs uppercase text-slateMuted">Job Title *</label>
                <input required value={editing.role || ''} onChange={(e) => setEditing({ ...editing, role: e.target.value })} className="mt-1 w-full rounded-xl border border-hairline bg-obsidian px-3.5 py-2.5 text-sm text-ivory" />
              </div>
              <div>
                <label className="text-xs uppercase text-slateMuted">Duration *</label>
                <input required value={editing.duration || ''} onChange={(e) => setEditing({ ...editing, duration: e.target.value })} placeholder="Sep 2025 – Present" className="mt-1 w-full rounded-xl border border-hairline bg-obsidian px-3.5 py-2.5 text-sm text-ivory" />
              </div>
              <div>
                <label className="text-xs uppercase text-slateMuted">Location *</label>
                <input required value={editing.location || ''} onChange={(e) => setEditing({ ...editing, location: e.target.value })} className="mt-1 w-full rounded-xl border border-hairline bg-obsidian px-3.5 py-2.5 text-sm text-ivory" />
              </div>
            </div>
            <div>
              <label className="text-xs uppercase text-slateMuted">Responsibilities (one per line)</label>
              <textarea rows={5} value={respText} onChange={(e) => setRespText(e.target.value)} className="mt-1 w-full rounded-xl border border-hairline bg-obsidian px-3.5 py-2.5 text-sm text-ivory" />
            </div>
            <div>
              <label className="text-xs uppercase text-slateMuted">Technologies (comma separated)</label>
              <input value={techText} onChange={(e) => setTechText(e.target.value)} className="mt-1 w-full rounded-xl border border-hairline bg-obsidian px-3.5 py-2.5 text-sm text-ivory" />
            </div>
            <label className="flex items-center gap-2 text-sm text-ivory">
              <input type="checkbox" checked={Boolean(editing.is_current)} onChange={(e) => setEditing({ ...editing, is_current: e.target.checked })} className="h-4 w-4 accent-[#B68B50]" />
              Current Position
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
