import type { UpdateTenantProfileRequest, RoomFilterRequest } from '../types/api/tenant.dto';

// Maps ProfileForm's UI state to Backend DTO
export function mapProfileToBackend(formData: any): UpdateTenantProfileRequest {
  return {
    // Take the first preferred location if it's a comma separated string, 
    // or just pass the whole string if backend allows it. 
    // Schema expects string min(2).
    preferredLocation: formData.preferredLocations?.split(',')[0]?.trim() || '',
    minBudget: Number(formData.budgetMin) || 0,
    maxBudget: Number(formData.budgetMax) || 0,
    moveInDate: formData.moveInDate || new Date().toISOString().split('T')[0],
  };
}

// Maps UI Filters to Backend DTO
export function mapFiltersToBackend(uiFilters: any): RoomFilterRequest {
  const filters: RoomFilterRequest = {};
  
  if (uiFilters.location) filters.location = uiFilters.location;
  if (uiFilters.minBudget) filters.minBudget = Number(uiFilters.minBudget);
  if (uiFilters.maxBudget) filters.maxBudget = Number(uiFilters.maxBudget);
  if (uiFilters.roomType && uiFilters.roomType !== 'all') {
    filters.roomType = uiFilters.roomType.toUpperCase() as any;
  }
  if (uiFilters.furnishing && uiFilters.furnishing !== 'all') {
    filters.furnishing = uiFilters.furnishing.toUpperCase() as any;
  }
  
  return filters;
}
