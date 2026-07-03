export interface CompatibilityScoreDto {
  id: string;
  tenantId: string;
  roomId: string;
  score: number;
  explanation: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface CompatibilityResponseDto {
  success: boolean;
  message: string;
  data: CompatibilityScoreDto;
}
