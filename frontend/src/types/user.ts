export interface User {
  id: string;
  email: string;
  role: 'owner' | 'tenant' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface OwnerProfile extends User {
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  roomsOwned?: number;
}

export interface TenantProfile extends User {
  firstName: string;
  lastName: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  budget: number;
  moveInDate: string;
  preferredLocations: string[];
  lifestyle: Record<string, any>;
}
