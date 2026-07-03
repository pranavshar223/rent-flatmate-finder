export interface CompatibilityScoreDomain {
  id: string;
  tenantId: string;
  roomId: string;
  score: number;
  explanation: string;
  createdAt: Date;
}
