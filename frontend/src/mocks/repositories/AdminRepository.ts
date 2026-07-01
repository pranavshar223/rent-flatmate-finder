export let mockUsers = [
  { id: 'u1', name: 'John Doe', email: 'john@example.com', role: 'tenant', status: 'active', lastActive: new Date().toISOString(), createdAt: new Date(Date.now() - 8640000000).toISOString(), avatar: 'https://i.pravatar.cc/150?u=u1' },
  { id: 'u2', name: 'Jane Smith', email: 'jane@example.com', role: 'owner', status: 'active', lastActive: new Date(Date.now() - 3600000).toISOString(), createdAt: new Date(Date.now() - 15000000000).toISOString(), avatar: 'https://i.pravatar.cc/150?u=u2' },
  { id: 'u3', name: 'Mike Johnson', email: 'mike@example.com', role: 'tenant', status: 'suspended', lastActive: new Date(Date.now() - 86400000 * 5).toISOString(), createdAt: new Date(Date.now() - 20000000000).toISOString(), avatar: 'https://i.pravatar.cc/150?u=u3' },
];

export let mockAuditLogs = [
  { id: 'al1', time: new Date().toISOString(), admin: 'SuperAdmin', action: 'CREATE', entity: 'Room', target: 'Room #12' },
  { id: 'al2', time: new Date(Date.now() - 3600000).toISOString(), admin: 'SuperAdmin', action: 'UPDATE', entity: 'User', target: 'User u3' },
  { id: 'al3', time: new Date(Date.now() - 7200000).toISOString(), admin: 'SuperAdmin', action: 'DELETE', entity: 'Room', target: 'Room #8' },
  { id: 'al4', time: new Date(Date.now() - 86400000).toISOString(), admin: 'SuperAdmin', action: 'LOGIN', entity: 'System', target: 'Self' },
];

export const AdminRepository = {
  getUsers: () => [...mockUsers],
  updateUserStatus: (id: string, status: string) => {
    const user = mockUsers.find(u => u.id === id);
    if (user) {
      user.status = status;
      AdminRepository.addAuditLog('UPDATE', 'User', `User ${id}`);
    }
  },
  getAuditLogs: () => [...mockAuditLogs],
  addAuditLog: (action: string, entity: string, target: string) => {
    mockAuditLogs.unshift({
      id: `al${Date.now()}`,
      time: new Date().toISOString(),
      admin: 'SuperAdmin',
      action,
      entity,
      target
    });
  }
};
