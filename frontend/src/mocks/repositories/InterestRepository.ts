import { mockInterests } from '../data/interests';

let interests = [...mockInterests];

export const InterestRepository = {
  findAll: async () => [...interests],
  findById: async (id: string) => interests.find(i => i.id === id),
  findByTenantId: async (tenantId: string) => interests.filter(i => i.tenantId === tenantId),
  findByOwnerId: async (ownerId: string) => interests.filter(i => i.ownerId === ownerId),
  save: async (interest: any) => {
    const idx = interests.findIndex(i => i.id === interest.id);
    if (idx >= 0) interests[idx] = interest;
    else interests.unshift(interest);
    return interest;
  },
  delete: async (id: string) => {
    interests = interests.filter(i => i.id !== id);
  }
};
