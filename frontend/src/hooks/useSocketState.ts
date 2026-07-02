import { useState, useEffect } from 'react';
import { socketManager, SocketConnectionState } from '../services/socket/SocketManager';

export const useSocketState = () => {
  const [connectionState, setConnectionState] = useState<SocketConnectionState>(socketManager.getConnectionState());

  useEffect(() => {
    // Subscribe to state changes from SocketManager
    const unsubscribe = socketManager.onStateChange((newState) => {
      setConnectionState(newState);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return connectionState;
};
