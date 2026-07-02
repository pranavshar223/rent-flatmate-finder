import { interestApi } from '../api/interest.api';
import { mapInterestStatusResponse, mapPaginatedInterests } from '../mappers/interest.mapper';
import { socketManager } from '../services/socket/SocketManager';

type Listener = (event: string, data: any) => void;
type EventCallback = (data: any) => void;

class InterestRepositoryClass {
  private listeners: Set<Listener> = new Set();
  private eventHandlers: Map<string, EventCallback> = new Map();

  constructor() {
    this.setupSocketListeners();
  }

  // --- API Methods ---
  async createInterest(roomId: string, message?: string) {
    const rawResponse = await interestApi.createInterest({ roomId, message });
    return mapInterestStatusResponse(rawResponse);
  }

  async getTenantRequests() {
    const rawResponse = await interestApi.getTenantRequests();
    return mapPaginatedInterests(rawResponse.data);
  }

  async getOwnerRequests() {
    const rawResponse = await interestApi.getOwnerRequests();
    return mapPaginatedInterests(rawResponse.data);
  }

  async cancelRequest(id: string) {
    const rawResponse = await interestApi.cancelRequest(id);
    return rawResponse;
  }

  async acceptRequest(id: string) {
    const rawResponse = await interestApi.acceptRequest(id);
    return mapInterestStatusResponse(rawResponse);
  }

  async rejectRequest(id: string) {
    const rawResponse = await interestApi.rejectRequest(id);
    return mapInterestStatusResponse(rawResponse);
  }

  async getRequestById(id: string) {
    const rawResponse = await interestApi.getRequestById(id);
    return mapInterestStatusResponse(rawResponse);
  }

  // --- Pub/Sub & Socket Integration ---
  subscribeToUpdates(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener); // Return unsubscribe function
  }

  private notifyListeners(event: string, data: any) {
    this.listeners.forEach((listener) => listener(event, data));
  }

  private setupSocketListeners() {
    const events = [
      'interest:created',
      'interest:accepted',
      'interest:rejected',
      'interest:cancelled',
      'match:created',
      'socket:reconnected'
    ];

    events.forEach((event) => {
      const handler = (data: any) => {
        console.log(`[InterestRepository] Received socket event: ${event}`, data);
        this.notifyListeners(event, data);
      };
      
      this.eventHandlers.set(event, handler);
      socketManager.on(event, handler);
    });
  }
}

export const InterestRepository = new InterestRepositoryClass();
