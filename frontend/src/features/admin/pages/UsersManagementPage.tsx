import { useState } from 'react';
import { useAdminUsers } from '../hooks/useAdminQueries';
import { useSuspendUser, useRestoreUser } from '../hooks/useAdminMutations';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

export const UsersManagementPage = () => {
  const { data: users = [], isLoading } = useAdminUsers();
  const [search, setSearch] = useState('');
  
  const suspendMutation = useSuspendUser();
  const restoreMutation = useRestoreUser();

  const filteredUsers = users.filter((u: any) => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Users Management" 
        subtitle="Search, filter, and moderate platform users." 
      />

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
        <div className="max-w-md">
          <Input 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Avatar</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last Active</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user: any) => (
                  <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3">
                      <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                    </td>
                    <td className="px-4 py-3 font-medium">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3 capitalize">{user.role}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.status === 'active' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(user.lastActive).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      {user.status === 'active' ? (
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => suspendMutation.mutate(user.id)}
                          disabled={suspendMutation.isPending}
                        >
                          Suspend
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => restoreMutation.mutate(user.id)}
                          disabled={restoreMutation.isPending}
                        >
                          Restore
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                      No users found.
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
