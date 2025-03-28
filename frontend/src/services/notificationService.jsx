import api from './api';

const notificationService = {
  // Get paginated notifications for a user
  getUserNotifications: async (userId, page = 0, size = 10) => {
    try {
      const response = await api.get(`/notifications/${userId}?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Get only unread notifications
  getUnreadNotifications: async (userId) => {
    try {
      const response = await api.get(`/notifications/${userId}/unread`);
      return response.data;
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      throw error;
    }
  },

  // Mark a specific notification as read
  markAsRead: async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (userId) => {
    try {
      await api.put(`/notifications/${userId}/read-all`);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Get notifications by type
  getNotificationsByType: async (userId, type) => {
    try {
      const response = await api.get(`/notifications/${userId}/type/${type}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications by type:', error);
      throw error;
    }
  },
};

export default notificationService;