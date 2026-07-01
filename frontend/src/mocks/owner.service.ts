import type { Room } from '../types/room';
import type { Interest } from '../types/interest';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Internal mock state to simulate DB
let mockRooms: Room[] = [
  {
    id: 'r1',
    ownerId: 'owner1',
    title: 'Spacious Master Bedroom with Ensuite',
    description: 'Looking for a flatmate to share this amazing apartment in downtown.',
    price: 1200,
    location: 'Downtown San Francisco',
    city: 'San Francisco',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'],
    amenities: ['Wi-Fi', 'In-unit Laundry', 'Gym'],
    rules: ['No pets', 'No smoking'],
    status: 'available',
    availableFrom: '2023-11-01T00:00:00.000Z',
    capacity: 1,
    createdAt: '2023-10-01T00:00:00.000Z',
    updatedAt: '2023-10-01T00:00:00.000Z',
  },
  {
    id: 'r2',
    ownerId: 'owner1',
    title: 'Cozy Room in Tech Hub',
    description: 'A small but cozy room close to all major tech offices.',
    price: 950,
    location: 'SOMA, San Francisco',
    city: 'San Francisco',
    images: ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80'],
    amenities: ['Wi-Fi', 'Balcony'],
    rules: ['Quiet hours after 10 PM'],
    status: 'available',
    availableFrom: '2023-10-15T00:00:00.000Z',
    capacity: 1,
    createdAt: '2023-10-05T00:00:00.000Z',
    updatedAt: '2023-10-05T00:00:00.000Z',
  }
];

let mockRequests: Interest[] = [
  {
    id: 'req1',
    roomId: 'r1',
    tenantId: 't1',
    status: 'pending',
    message: 'Hi, I love the room! Is it still available?',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tenant: {
      id: 't1',
      email: 'alex@example.com',
      role: 'tenant',
      firstName: 'Alex',
      lastName: 'Johnson',
      budget: 1300,
      moveInDate: '2023-11-01',
      preferredLocations: ['Downtown'],
      lifestyle: {},
      createdAt: '',
      updatedAt: ''
    }
  },
  {
    id: 'req2',
    roomId: 'r2',
    tenantId: 't2',
    status: 'accepted',
    message: 'Perfect location for my new job.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    tenant: {
      id: 't2',
      email: 'sarah@example.com',
      role: 'tenant',
      firstName: 'Sarah',
      lastName: 'Lee',
      budget: 1000,
      moveInDate: '2023-10-15',
      preferredLocations: ['SOMA'],
      lifestyle: {},
      createdAt: '',
      updatedAt: ''
    }
  }
];

export const OwnerService = {
  getDashboardStats: async (): Promise<ApiResponse<{ totalRooms: number, activeRooms: number, filledRooms: number, pendingRequests: number, acceptedRequests: number }>> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      message: "Dashboard stats fetched successfully",
      data: {
        totalRooms: mockRooms.length,
        activeRooms: mockRooms.filter(r => r.status === 'available').length,
        filledRooms: mockRooms.filter(r => r.status === 'rented').length,
        pendingRequests: mockRequests.filter(r => r.status === 'pending').length,
        acceptedRequests: mockRequests.filter(r => r.status === 'accepted').length,
      }
    };
  },

  getRooms: async (): Promise<ApiResponse<Room[]>> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      success: true,
      message: "Rooms fetched successfully",
      data: [...mockRooms]
    };
  },

  getRoomById: async (id: string): Promise<ApiResponse<Room>> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const room = mockRooms.find(r => r.id === id);
    if (!room) {
      throw new Error("Room not found");
    }
    return {
      success: true,
      message: "Room fetched successfully",
      data: { ...room }
    };
  },

  createRoom: async (data: Partial<Room>): Promise<ApiResponse<Room>> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newRoom: Room = {
      ...data,
      id: `r${Date.now()}`,
      ownerId: 'owner1',
      status: 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Room;
    mockRooms = [newRoom, ...mockRooms];
    return {
      success: true,
      message: "Room created successfully",
      data: newRoom
    };
  },

  updateRoom: async (id: string, data: Partial<Room>): Promise<ApiResponse<Room>> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = mockRooms.findIndex(r => r.id === id);
    if (index === -1) throw new Error("Room not found");
    
    const updatedRoom = { ...mockRooms[index], ...data, updatedAt: new Date().toISOString() };
    mockRooms[index] = updatedRoom;
    
    return {
      success: true,
      message: "Room updated successfully",
      data: updatedRoom
    };
  },

  deleteRoom: async (id: string): Promise<ApiResponse<null>> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    mockRooms = mockRooms.filter(r => r.id !== id);
    return {
      success: true,
      message: "Room deleted successfully",
      data: null
    };
  },

  getRequests: async (): Promise<ApiResponse<Interest[]>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      message: "Requests fetched successfully",
      data: [...mockRequests]
    };
  },
  
  getChats: async (): Promise<ApiResponse<any[]>> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      success: true,
      message: "Chats fetched successfully",
      data: [
        {
          id: 'c1',
          tenantName: 'Sarah Lee',
          lastMessage: 'Perfect location for my new job.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          unread: 2,
        },
        {
          id: 'c2',
          tenantName: 'Alex Johnson',
          lastMessage: 'Is it still available?',
          timestamp: new Date().toISOString(),
          unread: 0,
        }
      ]
    };
  }
};
