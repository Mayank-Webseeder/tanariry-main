import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';

const OrderNotificationContext = createContext();

export const useOrderNotifications = () => {
  const context = useContext(OrderNotificationContext);
  if (!context) {
    throw new Error('useOrderNotifications must be used within OrderNotificationProvider');
  }
  return context;
};

export const OrderNotificationProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);


  const isDevelopment = process.env.NODE_ENV === 'development';
  const envApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  

  const API_URL = isDevelopment 
    ? 'http://localhost:5000' 
    : (envApiUrl || 'http://localhost:5000');

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    console.log(`🔌 Connecting to WebSocket at: ${API_URL} (Mode: ${process.env.NODE_ENV})`);

    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${API_URL}/api/notifications`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const notifs = data.data?.notifications || data.notifications || [];
          const count = data.data?.unreadCount || data.unreadCount || 0;
          
          setNotifications(notifs);
          setUnreadCount(count);
        } else {
          if (response.status === 404) {
             console.warn('⚠️ Notification history endpoint 404 (Normal if backend feature is not deployed yet).');
          } else {
             console.error('Failed to fetch notifications:', response.statusText);
          }
        }
      } catch (error) {
        console.error('Failed to fetch notifications (Network/CORS?):', error.message);
      }
    };

    if (token) {
        fetchNotifications();
    } else {
        console.log('No auth token found, skipping socket connection');
        return;
    }

    const socketInstance = io(API_URL, {
      auth: {
        token: token
      },
      transports: ['polling', 'websocket'], 
      withCredentials: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('✅ Connected to order notification service', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('❌ Disconnected from order notification service:', reason);
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('❌ WebSocket Connection Error:', error.message);
      setIsConnected(false);
    });

    socketInstance.on('order:notification', (notification) => {
      console.log('📦 New order notification:', notification);
      
      setNotifications((prev) => [notification, ...prev]);
      
      setUnreadCount((prev) => prev + 1);
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/logo.png'
        });
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []); 

  const markAsRead = useCallback(async (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.timestamp === notificationId || notif._id === notificationId
          ? { ...notif, read: true }
          : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch(`${API_URL}/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        console.error('Failed to mark as read:', response.status);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [API_URL]);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
    setUnreadCount(0);

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/notifications/mark-all-read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.error('Failed to mark all as read:', response.status);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [API_URL]);

  const clearNotifications = useCallback(async () => {
    setNotifications([]);
    setUnreadCount(0);

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/notifications/read/all`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.warn('Backend DELETE endpoint not found. Falling back to marking all as read.');
        
        await fetch(`${API_URL}/api/notifications/mark-all-read`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
       console.log('Syncing clear action failed:', error.message);
    }
  }, [API_URL]);

  const value = {
    socket,
    notifications,
    isConnected,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications
  };

  return (
    <OrderNotificationContext.Provider value={value}>
      {children}
    </OrderNotificationContext.Provider>
  );
};
