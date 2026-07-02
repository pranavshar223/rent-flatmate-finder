export interface UpdateTenantProfileRequest {
  preferredLocation: string;
  minBudget: number;
  maxBudget: number;
  moveInDate: string;
  // Depending on how backend handles lifestyle in profile creation, we might need more fields.
}

export interface TenantProfileResponse {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  preferredLocation: string;
  minBudget: number;
  maxBudget: number;
  moveInDate: string;
  lifestyle?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface RoomFilterRequest {
  location?: string;
  minBudget?: number;
  maxBudget?: number;
  roomType?: 'SINGLE' | 'DOUBLE' | 'SHARED';
  furnishing?: 'FURNISHED' | 'SEMI_FURNISHED' | 'UNFURNISHED';
  page?: number;
  limit?: number;
  sort?: 'newest' | 'rent_asc' | 'rent_desc';
}
