import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, connected: false });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (token && user) {
      // Khởi tạo connection với JWT Token
      const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000';
      const newSocket = io(apiUrl, {
        auth: { token },
      });

      newSocket.on('connect', () => {
        setConnected(true);
        console.log('📡 Đã kết nối Socket.io với ID:', newSocket.id);
      });

      newSocket.on('disconnect', () => {
        setConnected(false);
        console.log('❌ Đã ngắt kết nối Socket.io');
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      setSocket(null);
      setConnected(false);
    }
  }, [token, user]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};
