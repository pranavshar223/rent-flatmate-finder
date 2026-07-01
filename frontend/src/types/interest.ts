import type { Room } from './room';
import type { TenantProfile } from './user';

export interface Interest {
  id: string;
  roomId: string;
  tenantId: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  createdAt: string;
  updatedAt: string;
  room?: Room;
  tenant?: TenantProfile;
}
