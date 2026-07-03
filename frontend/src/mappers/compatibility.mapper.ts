import type { CompatibilityScoreDto } from '../types/api/compatibility.dto';
import type { CompatibilityScoreDomain } from '../types/domain/compatibility';

export const mapCompatibilityToDomain = (dto: CompatibilityScoreDto): CompatibilityScoreDomain => {
  return {
    id: dto.id,
    tenantId: dto.tenantId,
    roomId: dto.roomId,
    score: dto.score,
    explanation: dto.explanation,
    createdAt: new Date(dto.createdAt),
  };
};
