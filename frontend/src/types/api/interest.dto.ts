import type { Interest } from '../interest';

export interface PaginatedInterestResponse {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  items: Interest[];
}

export interface InterestStatusResponse {
  status: string;
  data: Interest;
}

export interface InterestListResponse {
  status: string;
  data: PaginatedInterestResponse;
}
