import React, { useEffect, useState } from 'react';
import { Copy, FileText, Trash2, Upload } from 'lucide-react';
import { adminApi } from '../services/api';
import type { MediaAsset } from '../types/portfolio';

export const MediaLibrary: React.FC = () => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [category, setCategory] = useState('all');
  const [uploadCat, setUploadCat] = useState('projects');
  const [progress, setProgress] = useState<number | null>(null);

  const load = () => adminApi.listMedia(category).then(setAssets);
  useEffect(() => {
    load();
  }, [category]);

  const handleUpload = async (file: File) => {
    setProgress(0);
    try {
      await adminApi.uploadMedia(file, uploadCat, setProgress);
      await load();
    } finally {
      setProgress(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ivory">Media Library</h1>
          <p className="text-sm text-slateMuted">Upload and organize project screenshots, portraits, icons, and resume PDFs.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={uploadCat}
            onChange={(e) => setUploadCat(e.target.value)}
            className="rounded-xl border border-white/10 bg-surface px-3 py-2 text-xs text-ivory"
          >
            <option value="projects">Projects</option>
            <option value="profile">Profile</option>
            <option value="resume">Resume PDF</option>
            <option value="general">General</option>
          </select>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-xs font-semibold text-obsidian">
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

      <div className="flex flex-wrap gap-2">
        {['all', 'projects', 'profile', 'resume', 'general'].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-3.5 py-1.5 text-xs uppercase ${
              category === c ? 'bg-gold font-semibold text-obsidian' : 'border border-white/10 text-slateMuted'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {assets.map((asset) => (
          <div key={asset.id} className="glass-panel overflow-hidden rounded-2xl">
            <div className="flex h-36 items-center justify-center bg-obsidian">
              {asset.file_type === 'image' ? (
                <img src={asset.url} alt={asset.original_name} className="h-full w-full object-cover" />
              ) : (
                <FileText className="h-10 w-10 text-gold-light" />
              )}
            </div>
            <div className="p-3.5">
              <p className="truncate text-xs font-medium text-ivory">{asset.original_name}</p>
              <p className="mt-0.5 text-[10px] uppercase text-slateMuted">
                {asset.category} · {(asset.size_bytes / 1024).toFixed(1)} KB
              </p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(asset.url)}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1 text-[11px] text-slateMuted hover:text-ivory"
                >
                  <Copy className="h-3 w-3" />
                  Copy URL
                </button>
                <button
                  onClick={async () => {
                    if (window.confirm(`Delete "${asset.original_name}"?`)) {
                      await adminApi.deleteMedia(asset.id);
                      await load();
                    }
                  }}
                  className="rounded-lg p-1.5 text-rose-400 hover:bg-rose-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {assets.length === 0 && (
          <div className="glass-panel col-span-full rounded-2xl p-10 text-center text-sm text-slateMuted">
            No media files uploaded in this category yet.
          </div>
        )}
      </div>
    </div>
  );
};
