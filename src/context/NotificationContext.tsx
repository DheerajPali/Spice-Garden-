import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppNotification } from '../types/index';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  unreadCount: number;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allNotifications, setAllNotifications] = useState<AppNotification[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      setAllNotifications(JSON.parse(savedNotifications).map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp)
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(allNotifications));
  }, [allNotifications]);

  const addNotification = (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: AppNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    setAllNotifications(prev => [newNotification, ...prev]);

    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/vite.svg'
      });
    }
  };

  const markAsRead = (notificationId: string) => {
    setAllNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setAllNotifications(prev =>
      prev.map(notification => {
        // Only mark as read if it's for the current user
        const isForCurrentUser = user?.isAdmin 
          ? notification.isForAdmin || notification.userId === user.id
          : !notification.isForAdmin && (!notification.userId || notification.userId === user?.id);
        
        return isForCurrentUser ? { ...notification, read: true } : notification;
      })
    );
  };

  const clearNotifications = () => {
    setAllNotifications([]);
  };

  // Filter notifications based on user role and user ID
  const filteredNotifications = allNotifications.filter(notification => {
    if (user?.isAdmin) {
      return notification.isForAdmin || notification.userId === user.id;
    } else {
      return !notification.isForAdmin && (!notification.userId || notification.userId === user?.id);
    }
  });

  const unreadCount = filteredNotifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications: filteredNotifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      unreadCount,
      clearNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};