import React, { createContext, useState, useContext, useEffect } from 'react';
import { useMyContext } from '../store/ContextApi';
import notificationService from '../services/notificationService';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { currentUser, token } = useMyContext();
  
  // Fetch notifications on mount and when user changes
  useEffect(() => {
    if (currentUser?.id && token) {
      fetchUnreadNotifications();
      
      // Set up polling for new notifications (every 30 seconds)
      const intervalId = setInterval(() => {
        fetchUnreadNotifications(false);
      }, 30000);
      
      return () => clearInterval(intervalId);
    }
  }, [currentUser, token]);
  
  const fetchAllNotifications = async (page = 0, size = 10) => {
    if (!currentUser?.id) return;
    
    setLoading(true);
    try {
      const data = await notificationService.getUserNotifications(currentUser.id, page, size);
      setNotifications(data.content || []);
      setUnreadCount(data.content?.filter(n => !n.isRead).length || 0);
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchUnreadNotifications = async (showLoading = true) => {
    if (!currentUser?.id) return;
    
    if (showLoading) setLoading(true);
    try {
      const data = await notificationService.getUnreadNotifications(currentUser.id);
      setUnreadCount(data.length || 0);
      
      // Check if there are new notifications compared to last fetch
      const newNotifications = data.filter(
        newNotif => !notifications.some(n => n.notificationId === newNotif.notificationId)
      );
      
      // If there are new notifications, show a toast
      if (newNotifications.length > 0 && notifications.length > 0) {
        toast(`You have ${newNotifications.length} new notification${newNotifications.length > 1 ? 's' : ''}`, {
          icon: '🔔',
        });
      }
      
      // Update notifications state with new data (if available)
      if (data.length > 0) {
        setNotifications(prevNotifs => {
          // Merge existing and new notifications, remove duplicates
          const merged = [...data, ...prevNotifs];
          return [...new Map(merged.map(item => [item.notificationId, item])).values()]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        });
      }
    } catch (err) {
      console.error('Error fetching unread notifications:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };
  
  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.notificationId === notificationId 
            ? { ...notif, isRead: true } 
            : notif
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };
  
  const markAllAsRead = async () => {
    if (!currentUser?.id) return;
    
    try {
      await notificationService.markAllAsRead(currentUser.id);
      
      // Update local state
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };
  
  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchAllNotifications,
    fetchUnreadNotifications,
    markAsRead,
    markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);