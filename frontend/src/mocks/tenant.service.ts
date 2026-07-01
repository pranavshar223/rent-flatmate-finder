import type { Room } from '../types/room';
import type { Interest } from '../types/interest';
import type { TenantProfile } from '../types/user';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Internal mock data
const mockRooms: (Room & { compatibility?: { score: number, label: string, breakdown?: any, confidence?: string, explanation?: string } })[] = [
  {
    id: 'r3',
    ownerId: 'owner2',
    title: 'Luxury Studio in City Center',
    description: 'Modern luxury studio with amazing city views. Looking for a neat flatmate.',
    price: 1500,
    location: 'Downtown',
    city: 'San Francisco',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1e5240980c?w=800&q=80'],
    amenities: ['Gym', 'Pool', 'Doorman', 'In-unit Washer'],
    rules: ['No pets', 'No smoking'],
    status: 'available',
    availableFrom: '2023-11-01T00:00:00.000Z',
    capacity: 1,
    createdAt: '2023-10-01T00:00:00.000Z',
    updatedAt: '2023-10-01T00:00:00.000Z',
    compatibility: {
      score: 95,
      label: 'Excellent Match',
      confidence: 'Very High',
      explanation: 'This room closely matches your preferences, budget, and lifestyle choices.',
      breakdown: { budget: true, location: true, moveIn: true, roomType: true, lifestyle: true }
    }
  },
  {
    id: 'r1',
    ownerId: 'owner1',
    title: 'Spacious Master Bedroom',
    description: 'Looking for a flatmate to share this amazing apartment.',
    price: 1200,
    location: 'SOMA',
    city: 'San Francisco',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'],
    amenities: ['Wi-Fi', 'Gym'],
    rules: [],
    status: 'available',
    availableFrom: '2023-10-15T00:00:00.000Z',
    capacity: 1,
    createdAt: '2023-10-01T00:00:00.000Z',
    updatedAt: '2023-10-01T00:00:00.000Z',
    compatibility: {
      score: 88,
      label: 'Good Match',
      confidence: 'High',
      explanation: 'Great match on location and budget, but lifestyle preferences differ slightly.',
      breakdown: { budget: true, location: true, moveIn: true, roomType: true, lifestyle: false }
    }
  },
  {
    id: 'r4',
    ownerId: 'owner3',
    title: 'Budget Friendly Room',
    description: 'Small but cozy.',
    price: 800,
    location: 'Sunset District',
    city: 'San Francisco',
    images: ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80'],
    amenities: ['Wi-Fi'],
    rules: [],
    status: 'available',
    availableFrom: '2023-11-15T00:00:00.000Z',
    capacity: 1,
    createdAt: '2023-10-01T00:00:00.000Z',
    updatedAt: '2023-10-01T00:00:00.000Z',
    compatibility: {
      score: 65,
      label: 'Moderate Match',
      confidence: 'Moderate',
      explanation: 'Under budget, but location and move-in dates do not align well.',
      breakdown: { budget: true, location: false, moveIn: false, roomType: true, lifestyle: true }
    }
  }
];

let mockRequests: Interest[] = [
  {
    id: 'req_t1',
    roomId: 'r1',
    tenantId: 'tenant1',
    status: 'pending',
    message: 'Hi, I would love to see this place!',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    room: mockRooms.find(r => r.id === 'r1') as any
  },
  {
    id: 'req_t2',
    roomId: 'r3',
    tenantId: 'tenant1',
    status: 'accepted',
    message: 'Perfect!',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    room: mockRooms.find(r => r.id === 'r3') as any
  }
];

let mockProfile: Partial<TenantProfile> = {
  budget: 1500,
  preferredLocations: ['Downtown', 'SOMA'],
  moveInDate: '2023-11-01',
  lifestyle: {
    smoking: false,
    drinking: 'socially',
    pets: true,
  }
};

export const TenantService = {
  getDashboardStats: async (): Promise<ApiResponse<any>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      message: 'Dashboard fetched',
      data: {
        pendingRequests: mockRequests.filter(r => r.status === 'pending').length,
        acceptedRequests: mockRequests.filter(r => r.status === 'accepted').length,
        compatibilityAverage: 84,
        chats: 1
      }
    };
  },

  getRecommendedRooms: async (): Promise<ApiResponse<any[]>> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      success: true,
      message: 'Recommended rooms fetched',
      data: [...mockRooms].sort((a, b) => (b.compatibility?.score || 0) - (a.compatibility?.score || 0))
    };
  },

  getRooms: async (): Promise<ApiResponse<any[]>> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      success: true,
      message: 'Rooms fetched',
      data: [...mockRooms]
    };
  },

  getRoomById: async (id: string): Promise<ApiResponse<any>> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const room = mockRooms.find(r => r.id === id);
    if (!room) throw new Error("Room not found");
    return {
      success: true,
      message: 'Room fetched',
      data: room
    };
  },

  submitInterest: async (roomId: string, message: string): Promise<ApiResponse<Interest>> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const newReq: Interest = {
      id: `req_${Date.now()}`,
      roomId,
      tenantId: 'tenant1',
      status: 'pending',
      message,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as any;
    mockRequests = [newReq, ...mockRequests];
    return {
      success: true,
      message: 'Interest request submitted',
      data: newReq
    };
  },

  getRequests: async (): Promise<ApiResponse<Interest[]>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      message: 'Requests fetched',
      data: [...mockRequests]
    };
  },

  getProfile: async (): Promise<ApiResponse<Partial<TenantProfile>>> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      success: true,
      message: 'Profile fetched',
      data: { ...mockProfile }
    };
  },

  updateProfile: async (data: Partial<TenantProfile>): Promise<ApiResponse<Partial<TenantProfile>>> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    mockProfile = { ...mockProfile, ...data, lifestyle: { ...mockProfile.lifestyle, ...data.lifestyle } };
    return {
      success: true,
      message: 'Profile updated',
      data: mockProfile
    };
  },

  getChats: async (): Promise<ApiResponse<any[]>> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      success: true,
      message: 'Chats fetched',
      data: [
        {
          id: 'c1',
          ownerName: 'Alice (Owner of Studio)',
          lastMessage: 'Yes, it is still available!',
          timestamp: new Date().toISOString(),
          unread: 1,
        }
      ]
    };
  }
};
