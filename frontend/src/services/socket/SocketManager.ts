import { io, Socket } from 'socket.io-client';
import { supabase } from '../../api/supabase';

export const SocketConnectionState = {
  Connecting: 'Connecting',
  Connected: 'Connected',
  Reconnecting: 'Reconnecting',
  Disconnected: 'Disconnected'
} as const;

export type SocketConnectionState = typeof SocketConnectionState[keyof typeof SocketConnectionState];

type EventCallback = (data?: any) => void;

class SocketManager {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private connectionState: SocketConnectionState = SocketConnectionState.Disconnected;
  private stateListeners: Set<(state: SocketConnectionState) => void> = new Set();
  
  // To prevent infinite refresh loops
  private isRefreshingToken = false;

  private setState(newState: SocketConnectionState) {
    if (this.connectionState !== newState) {
      this.connectionState = newState;
      this.stateListeners.forEach(listener => listener(newState));
    }
  }

  public onStateChange(listener: (state: SocketConnectionState) => void) {
    this.stateListeners.add(listener);
    listener(this.connectionState); // Emit current state immediately
    return () => this.stateListeners.delete(listener);
  }

  public getConnectionState() {
    return this.connectionState;
  }

  async connect() {
    if (this.socket?.connected || this.connectionState === SocketConnectionState.Connecting) return;

    this.setState(SocketConnectionState.Connecting);
    console.log('[SocketManager] Connecting...');

    const token = localStorage.getItem('jwt_token');
    if (!token) {
      console.warn('[SocketManager] Cannot connect: No JWT token available');
      this.setState(SocketConnectionState.Disconnected);
      return;
    }

    const socketUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';

    this.socket = io(socketUrl, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.setupInternalListeners();
  }

  disconnect() {
    if (this.socket) {
      console.log('[SocketManager] Disconnecting...');
      this.socket.disconnect();
      this.socket = null;
      this.setState(SocketConnectionState.Disconnected);
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }

  emit(event: string, data?: any) {
    if (!this.socket?.connected) {
      console.warn(`[SocketManager] Cannot emit '${event}': Socket is disconnected`);
      return;
    }
    this.socket.emit(event, data);
  }

  on(event: string, callback: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
      if (this.socket) {
        this.socket.on(event, (data) => {
          this.listeners.get(event)?.forEach(cb => cb(data));
        });
      }
    }
    this.listeners.get(event)?.add(callback);
  }

  once(event: string, callback: EventCallback) {
    if (this.socket) {
      this.socket.once(event, callback);
    } else {
      console.warn(`[SocketManager] Cannot bind once('${event}'): Socket is not initialized`);
    }
  }

  off(event: string, callback: EventCallback) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
      if (eventListeners.size === 0) {
        this.listeners.delete(event);
        if (this.socket) {
          this.socket.off(event);
        }
      }
    }
  }

  private setupInternalListeners() {
    if (!this.socket) return;

    this.socket.io.on('reconnect_attempt', () => {
      this.setState(SocketConnectionState.Reconnecting);
      console.log('[SocketManager] Reconnecting...');
      const freshToken = localStorage.getItem('jwt_token');
      if (freshToken && this.socket) {
        this.socket.auth = { token: freshToken };
      }
    });

    this.socket.on('connect', () => {
      console.log('[SocketManager] Connected successfully:', this.socket?.id);
      this.setState(SocketConnectionState.Connected);
      
      // Notify application of reconnection
      this.notifyApplicationEvent('socket:reconnected', { socketId: this.socket?.id });
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`[SocketManager] Disconnected. Reason: ${reason}`);
      if (reason === 'io server disconnect') {
        // Disconnected by server explicitly
        this.setState(SocketConnectionState.Disconnected);
      } else {
        // Disconnected by network issue etc, will attempt reconnect automatically
        this.setState(SocketConnectionState.Reconnecting);
      }
    });

    this.socket.on('connect_error', async (err) => {
      console.error('[SocketManager] Connection Error:', err.message);
      
      if (err.message === 'Authentication error' && !this.isRefreshingToken) {
        console.log('[SocketManager] Attempting to refresh token...');
        this.isRefreshingToken = true;
        
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.access_token) {
            console.log('[SocketManager] Token refreshed successfully. Retrying connection...');
            localStorage.setItem('jwt_token', session.access_token);
            if (this.socket) {
              this.socket.auth = { token: session.access_token };
              this.socket.connect(); // Retry connection
            }
          } else {
            console.error('[SocketManager] Token refresh failed. No active session.');
            this.handleFatalAuthError();
          }
        } catch (error) {
          console.error('[SocketManager] Error during token refresh:', error);
          this.handleFatalAuthError();
        } finally {
          this.isRefreshingToken = false;
        }
      }
    });

    // Re-register application-level listeners to this new socket instance
    for (const [event, callbacks] of this.listeners.entries()) {
      this.socket.off(event); // Clear default to avoid duplicates
      this.socket.on(event, (data) => {
        callbacks.forEach(cb => cb(data));
      });
    }
  }

  private handleFatalAuthError() {
    this.disconnect();
    // Dispatch a global event so AuthContext can handle the actual logout UI/state changes
    window.dispatchEvent(new CustomEvent('auth:fatal_error'));
  }

  private notifyApplicationEvent(event: string, data?: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(data));
    }
  }
}

export const socketManager = new SocketManager();
