import React, { useEffect, useState } from 'react';
import { Check, Copy, FileText, Search, Trash2, Upload } from 'lucide-react';
import { adminApi } from '../services/api';
import type { MediaAsset } from '../types/portfolio';

export const MediaLibrary: React.FC = () => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [category, setCategory] = useState('all');
  const [uploadCat, setUploadCat] = useState('projects');
  const [search, setSearch] = useState('');
  const [dragging, setDragging] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  const load = () => adminApi.listMedia(category).then(setAssets);
  useEffect(() => {
    load();
  }, [category]);

  const handleUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('File must be under 10 MB.');
      return;
    }
    setProgress(0);
    try {
      await adminApi.uploadMedia(file, uploadCat, setProgress);
      await load();
    } finally {
      setProgress(null);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    for (const file of files) {
      await handleUpload(file);
    }
  };

  const filtered = assets.filter((a) =>
    search.trim() ? a.original_name.toLowerCase().includes(search.trim().toLowerCase()) : true
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ivory">Media Library</h1>
          <p className="text-sm text-slateMuted">Drag-and-drop project screenshots, portraits, icons, and resume PDFs.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={uploadCat}
            onChange={(e) => setUploadCat(e.target.value)}
            className="border border-hairline bg-surface px-3 py-2 text-xs text-ivory"
          >
            <option value="projects">Projects</option>
            <option value="profile">Profile</option>
            <option value="resume">Resume PDF</option>
            <option value="general">General</option>
          </select>
          <label className="inline-flex cursor-pointer items-center gap-2 bg-gold px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#080B12]">
            <Upload className="h-4 w-4" />
            {progress !== null ? `Uploading ${progress}%` : 'Upload Asset'}
            <input
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            />
          </label>
        </div>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center border-2 border-dashed p-8 text-center transition-colors ${
          dragging ? 'border-gold bg-gold/10' : 'border-hairline bg-surface/50'
        }`}
      >
        <Upload className="h-6 w-6 text-gold" />
        <p className="mt-2 text-sm font-medium text-ivory">
          Drag & drop images or PDFs here to upload to <span className="font-mono text-gold">{uploadCat}</span>
        </p>
        <p className="mt-1 text-xs text-slateMuted">Supports WebP, PNG, JPG, AVIF, SVG, PDF up to 10 MB</p>
      </div>

      {/* Search & Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {['all', 'projects', 'profile', 'resume', 'general'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider ${
                category === c
                  ? 'border-gold bg-gold font-semibold text-[#080B12]'
                  : 'border-hairline bg-surface text-slateMuted hover:text-ivory'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slateMuted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="w-full border border-hairline bg-surface py-2 pl-9 pr-3 text-xs text-ivory outline-none focus:border-gold"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((asset) => (
          <div key={asset.id} className="glass-panel overflow-hidden">
            <div className="flex h-36 items-center justify-center bg-obsidian">
              {asset.file_type === 'image' ? (
                <img src={asset.url} alt={asset.original_name} loading="lazy" className="h-full w-full object-cover" />
              ) : (
                <FileText className="h-10 w-10 text-gold" />
              )}
            </div>
            <div className="p-3.5">
              <p className="truncate text-xs font-medium text-ivory">{asset.original_name}</p>
              <p className="mt-0.5 font-mono text-[10px] uppercase text-slateMuted">
                {asset.category} · {(asset.size_bytes / 1024).toFixed(1)} KB
              </p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(asset.url);
                    setCopiedId(asset.id);
                    setTimeout(() => setCopiedId(null), 1500);
                  }}
                  className="inline-flex items-center gap-1 border border-hairline px-2.5 py-1 text-[11px] text-slateMuted hover:border-gold hover:text-ivory"
                >
                  {copiedId === asset.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  {copiedId === asset.id ? 'Copied' : 'Copy URL'}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm(`Delete "${asset.original_name}"?`)) {
                      await adminApi.deleteMedia(asset.id);
                      await load();
                    }
                  }}
                  className="p-1.5 text-rose-500 hover:bg-rose-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="glass-panel col-span-full p-10 text-center text-sm text-slateMuted">
            No media files found in this view.
          </div>
        )}
      </div>
    </div>
  );
};
