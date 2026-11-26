import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, CheckCircle2, KeyRound, Save, Upload } from 'lucide-react';
import { adminApi, authApi } from '../services/api';
import type { WebsiteSettings } from '../types/portfolio';

export const CmsSettingsManager: React.FC = () => {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [pwd, setPwd] = useState({ current: '', next: '' });

  useEffect(() => {
    adminApi.getSettings().then(setSettings);
  }, []);

  if (!settings) return <div className="text-sm text-slateMuted">Loading settings...</div>;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      const updated = await adminApi.updateSettings(settings);
      setSettings(updated);
      setNotice('Website CMS settings saved successfully.');
    } finally {
      setSaving(false);
    }
  };

  const moveSection = (idx: number, dir: -1 | 1) => {
    const next = [...settings.sections].sort((a, b) => a.order - b.order);
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    const reordered = next.map((s, i) => ({ ...s, order: i + 1 }));
    setSettings({ ...settings, sections: reordered });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    try {
      const res = await authApi.changePassword(pwd.current, pwd.next);
      setNotice(res.message);
      setPwd({ current: '', next: '' });
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setNotice(detail || 'Failed to update password.');
    }
  };

  const orderedSections = [...(settings.sections || [])].sort((a, b) => a.order - b.order);

  return (
    <div className="max-w-4xl space-y-8">
      <form onSubmit={handleSave} className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-ivory">Website CMS & Settings</h1>
            <p className="text-sm text-slateMuted">Control branding, accent color, SEO, animations, maintenance mode, and section order.</p>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-obsidian"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {notice && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-sm text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            {notice}
          </div>
        )}

        {/* Branding & Theme */}
        <div className="glass-panel grid gap-4 rounded-2xl p-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-xs uppercase text-slateMuted">Website Title</label>
            <input
              value={settings.site_title}
              onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
              className="mt-1 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
            />
          </div>
          <div>
            <label className="text-xs uppercase text-slateMuted">Monogram / Logo Text</label>
            <input
              value={settings.logo_text}
              onChange={(e) => setSettings({ ...settings, logo_text: e.target.value })}
              className="mt-1 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
            />
          </div>
          <div>
            <label className="text-xs uppercase text-slateMuted">Primary Accent Color</label>
            <div className="mt-1 flex items-center gap-3">
              <input
                type="color"
                value={settings.primary_accent || '#B68B50'}
                onChange={(e) => setSettings({ ...settings, primary_accent: e.target.value })}
                className="h-10 w-12 cursor-pointer rounded-lg border border-white/10 bg-obsidian"
              />
              <input
                value={settings.primary_accent}
                onChange={(e) => setSettings({ ...settings, primary_accent: e.target.value })}
                className="flex-1 rounded-xl border border-white/10 bg-obsidian px-3.5 py-2 text-sm text-ivory"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs uppercase text-slateMuted">SEO Meta Description</label>
            <textarea
              rows={2}
              value={settings.seo_description}
              onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })}
              className="mt-1 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs uppercase text-slateMuted">Social Media Share Image (Open Graph / Twitter)</label>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              {settings.og_image && (
                <img
                  src={settings.og_image}
                  alt="Social OG Preview"
                  className="h-16 w-28 rounded-xl border border-white/10 object-cover"
                />
              )}
              <input
                value={settings.og_image || ''}
                onChange={(e) => setSettings({ ...settings, og_image: e.target.value })}
                placeholder="/assets/social-media/og_hero_banner.webp"
                className="flex-1 rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
              />
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-2.5 text-xs font-medium text-gold-light hover:bg-gold/20">
                <Upload className="h-3.5 w-3.5" />
                Upload OG Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const asset = await adminApi.uploadMedia(file, 'general');
                    setSettings({ ...settings, og_image: asset.url });
                    setNotice('Social share image uploaded — click Save Settings to publish.');
                  }}
                />
              </label>
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs uppercase text-slateMuted">Footer Tagline</label>
            <input
              value={settings.footer_tagline}
              onChange={(e) => setSettings({ ...settings, footer_tagline: e.target.value })}
              className="mt-1 w-full rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
            />
          </div>

          <div className="flex flex-wrap gap-6 pt-2 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm text-ivory">
              <input
                type="checkbox"
                checked={settings.animations_enabled}
                onChange={(e) => setSettings({ ...settings, animations_enabled: e.target.checked })}
                className="h-4 w-4 accent-[#B68B50]"
              />
              Enable 3D & Smooth Animations
            </label>
            <label className="flex items-center gap-2 text-sm text-ivory">
              <input
                type="checkbox"
                checked={settings.custom_cursor_enabled}
                onChange={(e) => setSettings({ ...settings, custom_cursor_enabled: e.target.checked })}
                className="h-4 w-4 accent-[#B68B50]"
              />
              Custom Desktop Cursor
            </label>
            <label className="flex items-center gap-2 text-sm text-ivory">
              <input
                type="checkbox"
                checked={settings.analytics_enabled}
                onChange={(e) => setSettings({ ...settings, analytics_enabled: e.target.checked })}
                className="h-4 w-4 accent-[#B68B50]"
              />
              Privacy-Friendly Analytics
            </label>
            <label className="flex items-center gap-2 text-sm text-amber-300">
              <input
                type="checkbox"
                checked={settings.maintenance_mode}
                onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
                className="h-4 w-4 accent-amber-400"
              />
              Maintenance Mode
            </label>
          </div>
        </div>

        {/* Section Visibility & Ordering */}
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="font-display text-lg font-bold text-ivory">Homepage Section Visibility & Order</h2>
          <div className="mt-4 space-y-2.5">
            {orderedSections.map((sec, idx) => (
              <div
                key={sec.key}
                className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-obsidian/70 px-4 py-3"
              >
                <label className="flex items-center gap-3 text-sm text-ivory">
                  <input
                    type="checkbox"
                    checked={sec.is_visible}
                    onChange={(e) => {
                      const updated = orderedSections.map((s) =>
                        s.key === sec.key ? { ...s, is_visible: e.target.checked } : s
                      );
                      setSettings({ ...settings, sections: updated });
                    }}
                    className="h-4 w-4 accent-[#B68B50]"
                  />
                  {sec.label}
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => moveSection(idx, -1)}
                    className="rounded-lg border border-white/10 p-1.5 text-slateMuted hover:text-ivory"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSection(idx, 1)}
                    className="rounded-lg border border-white/10 p-1.5 text-slateMuted hover:text-ivory"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>

      {/* Change Admin Password */}
      <form onSubmit={handlePasswordChange} className="glass-panel rounded-2xl p-6 space-y-4">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ivory">
          <KeyRound className="h-4 w-4 text-gold-light" />
          Change Admin Password
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="password"
            required
            placeholder="Current Password"
            value={pwd.current}
            onChange={(e) => setPwd({ ...pwd, current: e.target.value })}
            className="rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
          />
          <input
            type="password"
            required
            minLength={8}
            placeholder="New Password (8+ chars)"
            value={pwd.next}
            onChange={(e) => setPwd({ ...pwd, next: e.target.value })}
            className="rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-sm text-ivory"
          />
        </div>
        <button type="submit" className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-2 text-xs font-semibold text-gold-light">
          Update Password
        </button>
      </form>
    </div>
  );
};
