import { AdminRepository } from './repositories/AdminRepository';
import { mockRooms } from './data/rooms';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const AdminService = {
  getDashboardOverview: async () => {
    await delay(500);
    const users = AdminRepository.getUsers();
    const rooms = mockRooms;
    
    return {
      success: true,
      data: {
        platformStatus: {
          overall: 'Healthy',
          backend: 'Connected',
          database: 'Connected',
          aiService: 'Connected',
          email: 'Connected',
          socket: 'Connected'
        },
        kpis: {
          users: users.length,
          rooms: rooms.length,
          requests: 45, // Mocked
          chats: 12, // Mocked
          aiMatches: 132,
          avgCompatibility: 88
        },
        aiHealth: {
          averageScore: 88,
          generatedToday: 132,
          highestMatch: 99,
          fallbackRate: 0
        },
        recentActivity: [
          { id: 1, type: 'room_created', message: 'Room Created', time: new Date().toISOString() },
          { id: 2, type: 'interest_sent', message: 'Interest Sent', time: new Date(Date.now() - 300000).toISOString() },
          { id: 3, type: 'chat_started', message: 'Chat Started', time: new Date(Date.now() - 600000).toISOString() },
          { id: 4, type: 'room_hidden', message: 'Room Hidden', time: new Date(Date.now() - 1200000).toISOString() },
          { id: 5, type: 'user_registered', message: 'User Registered', time: new Date(Date.now() - 1800000).toISOString() }
        ]
      }
    };
  },

  getUsers: async () => {
    await delay(300);
    return { success: true, data: AdminRepository.getUsers() };
  },

  getRooms: async () => {
    await delay(300);
    return { success: true, data: mockRooms };
  },

  getAnalytics: async () => {
    await delay(400);
    return {
      success: true,
      data: {
        usersByRole: [
          { name: 'Tenants', value: 420 },
          { name: 'Owners', value: 104 }
        ],
        interestStatus: [
          { name: 'Pending', value: 45, fill: '#f59e0b' },
          { name: 'Accepted', value: 30, fill: '#10b981' },
          { name: 'Rejected', value: 15, fill: '#ef4444' },
          { name: 'Cancelled', value: 10, fill: '#94a3b8' }
        ],
        newUsersLine: [
          { day: 'Mon', users: 12 },
          { day: 'Tue', users: 19 },
          { day: 'Wed', users: 15 },
          { day: 'Thu', users: 22 },
          { day: 'Fri', users: 28 },
          { day: 'Sat', users: 35 },
          { day: 'Sun', users: 40 }
        ]
      }
    };
  },

  getAuditLogs: async () => {
    await delay(300);
    return { success: true, data: AdminRepository.getAuditLogs() };
  },

  suspendUser: async (id: string) => {
    await delay(400);
    AdminRepository.updateUserStatus(id, 'suspended');
    return { success: true, message: 'User suspended' };
  },

  restoreUser: async (id: string) => {
    await delay(400);
    AdminRepository.updateUserStatus(id, 'active');
    return { success: true, message: 'User restored' };
  },

  hideRoom: async (id: string) => {
    await delay(400);
    // Add simple mock implementation
    AdminRepository.addAuditLog('UPDATE', 'Room', `Room ${id} hidden`);
    return { success: true, message: 'Room hidden' };
  },

  restoreRoom: async (id: string) => {
    await delay(400);
    AdminRepository.addAuditLog('UPDATE', 'Room', `Room ${id} restored`);
    return { success: true, message: 'Room restored' };
  }
};
