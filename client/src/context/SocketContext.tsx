import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext.js';
import { NotificationItem } from '../types/index.js';

interface SocketContextType {
  socket: Socket | null;
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {}
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const configuredSocketUrl = String(import.meta.env.VITE_SOCKET_URL || '').trim();
    const configuredApiUrl = String(import.meta.env.VITE_API_URL || '').trim();
    const socketUrl = configuredSocketUrl || (configuredApiUrl ? configuredApiUrl.replace(/\/api\/?$/, '') : 'http://localhost:5000');
    const s = io(socketUrl, { autoConnect: true });
    setSocket(s);

    if (user?.id) {
      s.emit('join_user', user.id);
    }

    s.on('notification', (newNotif: NotificationItem) => {
      setNotifications(prev => [newNotif, ...prev]);
    });

    return () => {
      s.disconnect();
    };
  }, [user?.id]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
  };

  return (
    <SocketContext.Provider value={{ socket, notifications, unreadCount, markAsRead }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
