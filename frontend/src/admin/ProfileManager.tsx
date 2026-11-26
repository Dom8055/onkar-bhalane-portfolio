import React, { useEffect, useState } from 'react';
import { CheckCircle2, FileText, Save, Upload } from 'lucide-react';
import { adminApi } from '../services/api';
import type { Profile } from '../types/portfolio';

export const ProfileManager: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadPct, setUploadPct] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getProfile().then(setProfile);
  }, []);

  if (!profile) return <div className="text-sm text-slateMuted">Loading profile...</div>;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const updated = await adminApi.updateProfile({
        name: profile.name,
        title: profile.title,
        subtitle: profile.subtitle,
        tagline: profile.tagline,
        summary: profile.summary,
        about_paragraphs: profile.about_paragraphs,
        core_competencies: profile.core_competencies,
        stats: profile.stats,
        profile_image: profile.profile_image,
        about_image: profile.about_image,
        secondary_portrait: profile.secondary_portrait,
        contact_image: profile.contact_image,
        hero_background_image: profile.hero_background_image,
        location: profile.location,
        email: profile.email,
        phone: profile.phone,
        availability_status: profile.availability_status,
        is_available: profile.is_available,
        social_links: profile.social_links,
      });
      setProfile(updated);
      setMessage('Profile updated successfully.');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (
    file: File,
    field: 'profile_image' | 'about_image' | 'secondary_portrait' | 'contact_image' | 'hero_background_image' | 'resume'
  ) => {
    if (field !== 'resume' && !file.type.startsWith('image/')) {
      setMessage('Please select a valid image file (WebP, PNG, JPG).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setMessage('File size must be under 10 MB.');
      return;
    }
    setUploadPct(0);
    try {
      const category = field === 'resume' ? 'resume' : 'profile';
      const asset = await adminApi.uploadMedia(file, category, setUploadPct);
      if (field !== 'resume') {
        const updated = await adminApi.updateProfile({ [field]: asset.url });
        setProfile(updated);
        setMessage(`Updated ${field.replace(/_/g, ' ')} successfully.`);
      } else {
        setMessage('Resume PDF uploaded! The Download Resume button now serves the new PDF.');
      }
    } finally {
      setUploadPct(null);
    }
  };

  return (
    <form onSubmit={handleSave} className="max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ivory">Profile & Resume Management</h1>
          <p className="text-sm text-slateMuted">Manage hero details, portrait, availability badge, social links, and resume PDF.</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-obsidian"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-sm text-emerald-300">
          <CheckCircle2 className="h-4 w-4" />
          {message}
        </div>
      )}

      {uploadPct !== null && (
        <div className="rounded-xl border border-gold/30 bg-surface p-3 text-xs text-gold-light">
          Uploading... {uploadPct}%
        </div>
      )}

      {/* Portrait, Hero, About, Contact & Resume Asset Slots */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(
          [
            { key: 'profile_image', label: 'Hero Primary Portrait' },
            { key: 'about_image', label: 'About Editorial Portrait' },
            { key: 'secondary_portrait', label: 'About Alternate Portrait' },
            { key: 'contact_image', label: 'Contact Section Portrait' },
            { key: 'hero_background_image', label: 'Hero Wide Background' },
          ] as const
        ).map((slot) => {
          const currentUrl = profile[slot.key];
          return (
            <div key={slot.key} className="glass-panel rounded-2xl p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-light">{slot.label}</p>
              <div className="mt-3 flex items-center gap-3">
                {currentUrl ? (
                  <img
                    src={currentUrl}
                    alt={slot.label}
                    className="h-16 w-16 shrink-0 rounded-xl border border-white/10 object-cover object-top"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-obsidian font-display text-xs font-bold text-gold-light">
                    IMG
                  </div>
                )}
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/15 bg-obsidian px-3 py-2 text-xs font-medium text-ivory hover:border-gold">
                  <Upload className="h-3.5 w-3.5 text-gold-light" />
                  Replace
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], slot.key)}
                  />
                </label>
              </div>
            </div>
          );
        })}

        <div className="glass-panel rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-gold-light">Resume PDF</p>
          <div className="mt-3 flex flex-col gap-2.5">
            <a
              href="/api/portfolio/resume"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-ivory hover:text-gold-light"
            >
              <FileText className="h-4 w-4 text-gold-light" />
              Preview Current Resume
            </a>
            <label className="inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-xl border border-gold/40 bg-gold/10 px-3 py-2 text-xs font-medium text-gold-light hover:bg-gold/20">
              <Upload className="h-3.5 w-3.5" />
              Upload New PDF
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'resume')}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Core Fields */}
      <div className="glass-panel grid gap-4 rounded-2xl p-6 sm:grid-cols-2">
        <div>
          <label className="text-xs uppercase text-slateMuted">Full Name</label>
          <input
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
          />
        </div>
        <div>
          <label className="text-xs uppercase text-slateMuted">Professional Title</label>
          <input
            value={profile.title}
            onChange={(e) => setProfile({ ...profile, title: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs uppercase text-slateMuted">Hero Tagline / Quote</label>
          <input
            value={profile.tagline}
            onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs uppercase text-slateMuted">About Me Paragraphs (separate with blank line)</label>
          <textarea
            rows={6}
            value={profile.about_paragraphs.join('\n\n')}
            onChange={(e) =>
              setProfile({
                ...profile,
                about_paragraphs: e.target.value
                  .split(/\n\s*\n/)
                  .map((p) => p.trim())
                  .filter(Boolean),
              })
            }
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
          />
        </div>
        <div>
          <label className="text-xs uppercase text-slateMuted">Email</label>
          <input
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
          />
        </div>
        <div>
          <label className="text-xs uppercase text-slateMuted">Phone</label>
          <input
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
          />
        </div>
        <div>
          <label className="text-xs uppercase text-slateMuted">Location</label>
          <input
            value={profile.location}
            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
          />
        </div>
        <div>
          <label className="text-xs uppercase text-slateMuted">Availability Badge Text</label>
          <input
            value={profile.availability_status}
            onChange={(e) => setProfile({ ...profile, availability_status: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
          />
        </div>
        <div className="flex items-center gap-3 sm:col-span-2">
          <input
            id="avail-toggle"
            type="checkbox"
            checked={profile.is_available}
            onChange={(e) => setProfile({ ...profile, is_available: e.target.checked })}
            className="h-4 w-4 accent-[#B68B50]"
          />
          <label htmlFor="avail-toggle" className="text-sm text-ivory">
            Show active green availability indicator in Hero section
          </label>
        </div>
      </div>

      {/* Social Links */}
      <div className="glass-panel grid gap-4 rounded-2xl p-6 sm:grid-cols-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-gold-light sm:col-span-2">Social & Professional Links</p>
        {(['linkedin', 'github', 'portfolio', 'twitter', 'website'] as const).map((field) => (
          <div key={field}>
            <label className="text-xs uppercase text-slateMuted">{field}</label>
            <input
              value={profile.social_links?.[field] || ''}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  social_links: { ...profile.social_links, [field]: e.target.value },
                })
              }
              placeholder={`https://...`}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
            />
          </div>
        ))}
      </div>
    </form>
  );
};
