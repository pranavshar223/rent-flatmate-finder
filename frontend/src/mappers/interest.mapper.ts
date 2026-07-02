import type { Interest } from '../types/interest';
import type { InterestStatusResponse, PaginatedInterestResponse } from '../types/api/interest.dto';

export const mapInterest = (raw: any): Interest => {
  return {
    id: raw.id,
    roomId: raw.roomId,
    tenantId: raw.tenantId,
    status: raw.status.toLowerCase(), // Ensure lowercase as per domain model
    message: raw.message,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    room: raw.room ? {
      ...raw.room,
      // Map nested models if required, though keeping it simple here
    } : undefined,
    tenant: raw.tenant ? {
      ...raw.tenant
    } : undefined,
  };
};

export const mapPaginatedInterests = (response: PaginatedInterestResponse) => {
  return {
    ...response,
    items: response.items.map(mapInterest)
  };
};

export const mapInterestStatusResponse = (response: InterestStatusResponse) => {
  return {
    ...response,
    data: mapInterest(response.data)
  };
};
