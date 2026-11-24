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
    { label: 'Total Projects', value: m.total_projects, sub: `${m.published_projects} published · ${m.draft_projects} draft`, icon: FolderKanban },
    { label: 'Featured Projects', value: m.featured_projects, sub: `${m.total_skills} total skills`, icon: Star },
    { label: 'Contact Inquiries', value: m.total_inquiries, sub: `${m.unread_inquiries} unread messages`, icon: Mail },
    { label: 'Portfolio Views', value: m.portfolio_views, sub: `${m.resume_downloads} resume downloads`, icon: Eye },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ivory sm:text-3xl">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-slateMuted">Real-time metrics and quick actions for your portfolio.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-xs font-semibold text-obsidian"
          >
            <Plus className="h-4 w-4" />
            Manage Projects
          </Link>
          <Link
            to="/admin/media"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-surface px-4 py-2.5 text-xs font-medium text-ivory hover:border-gold/40"
          >
            <Image className="h-4 w-4 text-gold-light" />
            Upload Media
          </Link>
          <Link
            to="/admin/settings"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-surface px-4 py-2.5 text-xs font-medium text-ivory hover:border-gold/40"
          >
            <Settings className="h-4 w-4 text-gold-light" />
            CMS Settings
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="glass-panel rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-slateMuted">{kpi.label}</span>
                <Icon className="h-4 w-4 text-gold-light" />
              </div>
              <p className="mt-3 font-display text-3xl font-bold text-ivory">{kpi.value}</p>
              <p className="mt-1 text-xs text-slateMuted">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Inquiries */}
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-ivory">Recent Inquiries</h2>
            <Link to="/admin/inquiries" className="text-xs text-gold-light hover:underline">
              View All
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {data.recent_messages.length === 0 ? (
              <p className="text-sm text-slateMuted">No inquiries yet.</p>
            ) : (
              data.recent_messages.map((msg) => (
                <div key={msg.id} className="rounded-xl border border-white/[0.06] bg-obsidian/70 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-ivory">{msg.name}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        msg.is_read ? 'bg-white/10 text-slateMuted' : 'bg-gold/20 text-gold-light'
                      }`}
                    >
                      {msg.is_read ? msg.status : 'Unread'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gold-light">{msg.subject}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-slateMuted">{msg.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ivory">
              <Activity className="h-4 w-4 text-gold-light" />
              Recent Activity
            </h2>
            <Link to="/admin/activity" className="text-xs text-gold-light hover:underline">
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
                  className="flex items-start justify-between gap-3 rounded-xl border border-white/[0.05] bg-obsidian/60 px-4 py-3 text-xs"
                >
                  <div>
                    <span className="font-mono uppercase text-gold-light">{log.action}</span>{' '}
                    <span className="text-ivory">{log.details}</span>
                  </div>
                  <span className="shrink-0 text-[11px] text-slateMuted">
                    {new Date(log.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Media & Resume Quick Card */}
      <div className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <Download className="h-5 w-5 text-gold-light" />
          <div>
            <p className="text-sm font-semibold text-ivory">Resume & Media Assets</p>
            <p className="text-xs text-slateMuted">{m.total_media} uploaded files in Media Library</p>
          </div>
        </div>
        <Link
          to="/admin/profile"
          className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-2 text-xs font-medium text-gold-light hover:bg-gold/20"
        >
          Update Portrait & Resume PDF
        </Link>
      </div>
    </div>
  );
};
