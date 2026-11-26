import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Download,
  Eye,
  FolderKanban,
  Image,
  Mail,
  Plus,
  Settings,
  Star,
} from 'lucide-react';
import { LiquidGlassCard, LiquidGlassPanel } from '../components/liquid-glass';
import { adminApi } from '../services/api';
import type { DashboardResponse } from '../types/portfolio';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getDashboard()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <div className="text-sm text-slateMuted">Loading dashboard metrics...</div>;
  }

  const m = data.metrics;
  const kpis = [
    { label: 'Total Projects', value: m.total_projects, sub: `${m.published_projects} published · ${m.draft_projects} draft`, icon: FolderKanban, tint: 'gold' as const },
    { label: 'Featured Apps', value: m.featured_projects, sub: `${m.total_skills} skills indexed`, icon: Star, tint: 'blue' as const },
    { label: 'Inquiries', value: m.total_inquiries, sub: `${m.unread_inquiries} unread messages`, icon: Mail, tint: 'emerald' as const },
    { label: 'Portfolio Views', value: m.portfolio_views, sub: `${m.resume_downloads} resume downloads`, icon: Eye, tint: 'neutral' as const },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">Overview</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-ivory sm:text-3xl">CMS Dashboard</h1>
          <p className="mt-1 text-sm text-slateMuted">Live MongoDB metrics, inquiries, and audit history.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-light px-5 py-2.5 text-xs font-semibold text-[#080B12] shadow-goldGlow"
          >
            <Plus className="h-4 w-4" />
            Manage Projects
          </Link>
          <Link
            to="/admin/media"
            className="liquid-glass inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium text-ivory hover:border-gold"
          >
            <Image className="h-4 w-4 text-gold" />
            Media Library
          </Link>
          <Link
            to="/admin/settings"
            className="liquid-glass inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium text-ivory hover:border-gold"
          >
            <Settings className="h-4 w-4 text-gold" />
            Settings
          </Link>
        </div>
      </div>

      {/* Liquid Glass KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <LiquidGlassCard key={kpi.label} tint={kpi.tint} className="p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slateMuted">{kpi.label}</span>
                <Icon className="h-4 w-4 text-gold" />
              </div>
              <p className="mt-3 font-display text-3xl font-bold text-ivory">{kpi.value}</p>
              <p className="mt-1 text-xs text-slateMuted">{kpi.sub}</p>
            </LiquidGlassCard>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Inquiries */}
        <LiquidGlassPanel className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-ivory">Recent Inquiries</h2>
            <Link to="/admin/inquiries" className="text-xs font-medium text-gold hover:underline">
              View All
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {data.recent_messages.length === 0 ? (
              <p className="text-sm text-slateMuted">No inquiries yet.</p>
            ) : (
              data.recent_messages.map((msg) => (
                <div key={msg.id} className="rounded-2xl border border-hairline bg-surface p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-ivory">{msg.name}</p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase ${
                        msg.is_read ? 'border border-hairline text-slateMuted' : 'bg-gold/20 text-gold'
                      }`}
                    >
                      {msg.is_read ? msg.status : 'Unread'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-gold">{msg.subject}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-slateMuted">{msg.message}</p>
                </div>
              ))
            )}
          </div>
        </LiquidGlassPanel>

        {/* Recent Activity */}
        <LiquidGlassPanel className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ivory">
              <Activity className="h-4 w-4 text-gold" />
              Recent Activity
            </h2>
            <Link to="/admin/activity" className="text-xs font-medium text-gold hover:underline">
              Full Audit Log
            </Link>
          </div>
          <div className="mt-4 space-y-2.5">
            {data.recent_activity.length === 0 ? (
              <p className="text-sm text-slateMuted">No activity recorded yet.</p>
            ) : (
              data.recent_activity.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start justify-between gap-3 rounded-2xl border border-hairline bg-surface px-4 py-3 text-xs"
                >
                  <div>
                    <span className="font-mono uppercase text-gold">{log.action}</span>{' '}
                    <span className="text-ivory">{log.details}</span>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] text-slateMuted">
                    {new Date(log.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </LiquidGlassPanel>
      </div>

      {/* Media & Resume Banner */}
      <LiquidGlassPanel className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3">
          <Download className="h-5 w-5 text-gold" />
          <div>
            <p className="text-sm font-semibold text-ivory">Portraits, Resume & Media Assets</p>
            <p className="text-xs text-slateMuted">{m.total_media} uploaded files tracked in Media Library</p>
          </div>
        </div>
        <Link
          to="/admin/profile"
          className="liquid-glass rounded-full border border-gold/40 px-5 py-2 text-xs font-semibold text-gold hover:bg-gold hover:text-[#080B12]"
        >
          Update Portraits & Resume PDF
        </Link>
      </LiquidGlassPanel>
    </div>
  );
};
