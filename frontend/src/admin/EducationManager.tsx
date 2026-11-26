import React, { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { adminApi } from '../services/api';
import type { Education } from '../types/portfolio';

export const EducationManager: React.FC = () => {
  const [items, setItems] = useState<Education[]>([]);
  const [editing, setEditing] = useState<Partial<Education> | null>(null);

  const load = () => adminApi.listEducation().then(setItems);
  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (editing.id) {
      await adminApi.updateEducation(editing.id, editing);
    } else {
      await adminApi.createEducation(editing);
    }
    setEditing(null);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ivory">Education Management</h1>
          <p className="text-sm text-slateMuted">Manage academic qualifications displayed on your portfolio.</p>
        </div>
        <button
          onClick={() => setEditing({ degree: '', institution: '', location: 'Nagpur', duration: '', order: items.length + 1, is_visible: true })}
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-semibold text-[#080B12]"
        >
          <Plus className="h-4 w-4" />
          Add Education
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((edu) => (
          <div key={edu.id} className="glass-panel flex items-start justify-between rounded-2xl p-5">
            <div>
              <p className="font-mono text-xs text-gold-light">{edu.duration}</p>
              <p className="mt-1 font-display text-lg font-bold text-ivory">{edu.degree}</p>
              <p className="text-sm text-slateMuted">
                {edu.institution} · {edu.location}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(edu)} className="rounded-lg border border-hairline p-2 text-slateMuted hover:text-ivory">
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={async () => {
                  if (window.confirm(`Delete "${edu.degree}"?`)) {
                    await adminApi.deleteEducation(edu.id);
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
              <h2 className="font-display text-lg font-bold text-ivory">{editing.id ? 'Edit Education' : 'Add Education'}</h2>
              <button type="button" onClick={() => setEditing(null)}>
                <X className="h-5 w-5 text-slateMuted" />
              </button>
            </div>
            <div>
              <label className="text-xs uppercase text-slateMuted">Degree / Certificate *</label>
              <input required value={editing.degree || ''} onChange={(e) => setEditing({ ...editing, degree: e.target.value })} className="mt-1 w-full rounded-xl border border-hairline bg-obsidian px-3.5 py-2.5 text-sm text-ivory" />
            </div>
            <div>
              <label className="text-xs uppercase text-slateMuted">Institution *</label>
              <input required value={editing.institution || ''} onChange={(e) => setEditing({ ...editing, institution: e.target.value })} className="mt-1 w-full rounded-xl border border-hairline bg-obsidian px-3.5 py-2.5 text-sm text-ivory" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs uppercase text-slateMuted">Duration *</label>
                <input required value={editing.duration || ''} onChange={(e) => setEditing({ ...editing, duration: e.target.value })} className="mt-1 w-full rounded-xl border border-hairline bg-obsidian px-3.5 py-2.5 text-sm text-ivory" />
              </div>
              <div>
                <label className="text-xs uppercase text-slateMuted">Location</label>
                <input value={editing.location || ''} onChange={(e) => setEditing({ ...editing, location: e.target.value })} className="mt-1 w-full rounded-xl border border-hairline bg-obsidian px-3.5 py-2.5 text-sm text-ivory" />
              </div>
            </div>
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
