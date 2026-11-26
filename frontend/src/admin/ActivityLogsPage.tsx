import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { adminApi } from '../services/api';
import type { ActivityLog } from '../types/portfolio';

export const ActivityLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    adminApi.listActivityLogs(100).then(setLogs);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl font-bold text-ivory">
          <Activity className="h-6 w-6 text-gold-light" />
          Admin Activity Logs
        </h1>
        <p className="text-sm text-slateMuted">Audit trail of logins, content updates, media uploads, and settings changes.</p>
      </div>

      <div className="glass-panel overflow-x-auto rounded-2xl">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-hairline uppercase text-slateMuted">
            <tr>
              <th className="px-5 py-3.5">Timestamp</th>
              <th className="px-5 py-3.5">Admin</th>
              <th className="px-5 py-3.5">Action</th>
              <th className="px-5 py-3.5">Entity</th>
              <th className="px-5 py-3.5">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-surface">
                <td className="px-5 py-3.5 font-mono text-slateMuted">
                  {new Date(log.created_at).toLocaleString()}
                </td>
                <td className="px-5 py-3.5 text-ivory">{log.admin_email}</td>
                <td className="px-5 py-3.5">
                  <span className="rounded-full bg-gold/15 px-2.5 py-0.5 font-mono uppercase text-gold-light">
                    {log.action}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-slateMuted">{log.entity_type}</td>
                <td className="px-5 py-3.5 text-ivory">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
