export interface CompatibilityScore {
  roomId: string;
  tenantId: string;
  score: number;
  explanation: string;
  breakdown: {
    budget: number;
    lifestyle: number;
    preferences: number;
  };
  cachedAt: string;
}
