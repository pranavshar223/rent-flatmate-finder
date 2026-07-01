import { useState } from 'react';
import { useAdminAuditLogs } from '../hooks/useAdminQueries';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Input } from '../../../components/ui/input';

export const AuditLogsPage = () => {
  const { data: logs = [], isLoading } = useAdminAuditLogs();
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter((l: any) => 
    l.action.toLowerCase().includes(search.toLowerCase()) || 
    l.target.toLowerCase().includes(search.toLowerCase()) ||
    l.admin.toLowerCase().includes(search.toLowerCase())
  );

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'text-success bg-success/10 border-success/20';
      case 'UPDATE': return 'text-warning bg-warning/10 border-warning/20';
      case 'DELETE': return 'text-danger bg-danger/10 border-danger/20';
      case 'LOGIN': return 'text-primary bg-primary/10 border-primary/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Audit Logs" 
        subtitle="Track all administrative actions performed on the platform." 
      />

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
        <div className="max-w-md">
          <Input 
            placeholder="Search logs..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Loading audit logs...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Admin</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Entity</th>
                  <th className="px-4 py-3">Target</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log: any) => (
                  <tr key={log.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {new Date(log.time).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-medium">{log.admin}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">{log.entity}</td>
                    <td className="px-4 py-3">{log.target}</td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      No logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
