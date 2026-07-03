import { compatibilityApi } from '../api/compatibility.api';
import { mapCompatibilityToDomain } from '../mappers/compatibility.mapper';
import type { CompatibilityScoreDomain } from '../types/domain/compatibility';

class CompatibilityRepository {
  async getRoomCompatibility(roomId: string): Promise<CompatibilityScoreDomain> {
    const response = await compatibilityApi.getCompatibility(roomId);
    return mapCompatibilityToDomain(response.data);
  }

  async getTenantCompatibilities(): Promise<CompatibilityScoreDomain[]> {
    const response = await compatibilityApi.getTenantCompatibilities();
    return response.data.map(mapCompatibilityToDomain);
  }
}

export const compatibilityRepository = new CompatibilityRepository();
