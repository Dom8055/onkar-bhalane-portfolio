import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Pencil, Plus, Star, Trash2, Upload, X } from 'lucide-react';
import { adminApi } from '../services/api';
import type { Project } from '../types/portfolio';

const EMPTY_PROJECT: Partial<Project> = {
  title: '',
  subtitle: '',
  category: 'E-Commerce',
  industry_badge: '',
  short_description: '',
  full_description: '',
  contribution: [],
  technologies: [],
  cover_image: '',
  gallery_images: [],
  google_play_url: '',
  app_store_url: '',
  github_url: '',
  live_url: '',
  is_featured: false,
  is_published: true,
  order: 0,
};

export const ProjectsManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [techInput, setTechInput] = useState('');
  const [contribInput, setContribInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = () => adminApi.listProjects().then(setProjects);

  useEffect(() => {
    load();
  }, []);

  const openEditor = (proj?: Project) => {
    if (proj) {
      setEditing({ ...proj });
      setTechInput(proj.technologies.join(', '));
      setContribInput(proj.contribution.join('\n'));
    } else {
      setEditing({ ...EMPTY_PROJECT, order: projects.length + 1 });
      setTechInput('');
      setContribInput('');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const payload: Partial<Project> = {
      ...editing,
      technologies: techInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      contribution: contribInput
        .split('\n')
        .map((c) => c.trim())
        .filter(Boolean),
    };
    try {
      if (editing.id) {
        await adminApi.updateProject(editing.id, payload);
      } else {
        await adminApi.createProject(payload);
      }
      setEditing(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (proj: Project) => {
    if (!window.confirm(`Delete project "${proj.title}"? This action cannot be undone.`)) return;
    await adminApi.deleteProject(proj.id);
    await load();
  };

  const toggleFlag = async (proj: Project, field: 'is_published' | 'is_featured') => {
    await adminApi.updateProject(proj.id, { [field]: !proj[field] });
    await load();
  };

  const handleImageUpload = async (file: File, target: 'cover' | 'gallery') => {
    if (!editing) return;
    setUploading(true);
    try {
      const asset = await adminApi.uploadMedia(file, 'projects');
      if (target === 'cover') {
        setEditing({ ...editing, cover_image: asset.url });
      } else {
        setEditing({ ...editing, gallery_images: [...(editing.gallery_images || []), asset.url] });
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ivory">Projects Management</h1>
          <p className="text-sm text-slateMuted">Add, edit, publish, feature, reorder, and upload screenshots for all projects.</p>
        </div>
        <button
          onClick={() => openEditor()}
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-semibold text-obsidian"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </button>
      </div>

      {/* Table */}
      <div className="glass-panel overflow-x-auto rounded-2xl">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/[0.07] text-xs uppercase text-slateMuted">
            <tr>
              <th className="px-5 py-3.5">Order</th>
              <th className="px-5 py-3.5">Project</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-white/[0.02]">
                <td className="px-5 py-4 font-mono text-xs text-slateMuted">#{p.order}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {p.cover_image ? (
                      <img src={p.cover_image} alt={p.title} className="h-10 w-14 rounded-lg object-cover" />
                    ) : (
                      <div className="flex h-10 w-14 items-center justify-center rounded-lg border border-white/10 bg-obsidian font-mono text-[10px] text-slateMuted">
                        IMG
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-ivory">{p.title}</p>
                      <p className="text-xs text-slateMuted">{p.technologies.slice(0, 4).join(' · ')}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-xs text-gold-light">{p.category}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFlag(p, 'is_published')}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        p.is_published ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/10 text-slateMuted'
                      }`}
                    >
                      {p.is_published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      {p.is_published ? 'Published' : 'Draft'}
                    </button>
                    <button
                      onClick={() => toggleFlag(p, 'is_featured')}
                      title="Toggle Featured"
                      className={`rounded-full p-1.5 ${
                        p.is_featured ? 'bg-gold/20 text-gold-light' : 'text-slateMuted hover:text-ivory'
                      }`}
                    >
                      <Star className={`h-3.5 w-3.5 ${p.is_featured ? 'fill-gold-light' : ''}`} />
                    </button>
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      onClick={() => openEditor(p)}
                      className="rounded-lg border border-white/10 p-2 text-slateMuted hover:border-gold/40 hover:text-ivory"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      className="rounded-lg border border-rose-500/20 p-2 text-rose-400 hover:bg-rose-500/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Editor */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleSave}
            className="glass-panel-gold max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl p-6 sm:p-8"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="font-display text-xl font-bold text-ivory">
                {editing.id ? 'Edit Project' : 'New Project'}
              </h2>
              <button type="button" onClick={() => setEditing(null)} className="text-slateMuted hover:text-ivory">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs uppercase text-slateMuted">Title *</label>
                <input
                  required
                  value={editing.title || ''}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-slateMuted">Category *</label>
                <input
                  required
                  value={editing.category || ''}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-slateMuted">Subtitle</label>
                <input
                  value={editing.subtitle || ''}
                  onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-slateMuted">Display Order</label>
                <input
                  type="number"
                  value={editing.order || 0}
                  onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs uppercase text-slateMuted">Short Description *</label>
                <textarea
                  required
                  rows={2}
                  value={editing.short_description || ''}
                  onChange={(e) => setEditing({ ...editing, short_description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs uppercase text-slateMuted">Full Case Study Description</label>
                <textarea
                  rows={3}
                  value={editing.full_description || ''}
                  onChange={(e) => setEditing({ ...editing, full_description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs uppercase text-slateMuted">Contributions (one bullet per line)</label>
                <textarea
                  rows={3}
                  value={contribInput}
                  onChange={(e) => setContribInput(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs uppercase text-slateMuted">Technologies (comma separated)</label>
                <input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="Flutter, Dart, GetX, REST API"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-slateMuted">Google Play URL</label>
                <input
                  value={editing.google_play_url || ''}
                  onChange={(e) => setEditing({ ...editing, google_play_url: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-slateMuted">App Store URL</label>
                <input
                  value={editing.app_store_url || ''}
                  onChange={(e) => setEditing({ ...editing, app_store_url: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-slateMuted">GitHub URL</label>
                <input
                  value={editing.github_url || ''}
                  onChange={(e) => setEditing({ ...editing, github_url: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-slateMuted">Live Demo URL</label>
                <input
                  value={editing.live_url || ''}
                  onChange={(e) => setEditing({ ...editing, live_url: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
                />
              </div>

              {/* Cover & Gallery Upload */}
              <div className="sm:col-span-2">
                <label className="text-xs uppercase text-slateMuted">Cover Image & Gallery Screenshots</label>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-2 text-xs font-medium text-gold-light">
                    <Upload className="h-3.5 w-3.5" />
                    {uploading ? 'Uploading...' : 'Upload Cover Image'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'cover')}
                    />
                  </label>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-obsidian px-4 py-2 text-xs font-medium text-ivory">
                    <Upload className="h-3.5 w-3.5" />
                    Add Gallery Screenshot
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'gallery')}
                    />
                  </label>
                </div>
                {editing.cover_image && (
                  <p className="mt-2 text-xs text-emerald-300">Cover set: {editing.cover_image}</p>
                )}
              </div>

              <div className="flex items-center gap-6 sm:col-span-2">
                <label className="flex items-center gap-2 text-sm text-ivory">
                  <input
                    type="checkbox"
                    checked={Boolean(editing.is_published)}
                    onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })}
                    className="h-4 w-4 accent-[#B68B50]"
                  />
                  Published
                </label>
                <label className="flex items-center gap-2 text-sm text-ivory">
                  <input
                    type="checkbox"
                    checked={Boolean(editing.is_featured)}
                    onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })}
                    className="h-4 w-4 accent-[#B68B50]"
                  />
                  Featured
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-slateMuted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-gold px-6 py-2.5 text-sm font-semibold text-obsidian"
              >
                {saving ? 'Saving...' : 'Save Project'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
