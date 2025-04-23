import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import NotificationItem from './NotificationItem';
import { Spinner, Badge, Tabs, Button } from 'flowbite-react';
import { HiOutlineCheckCircle, HiOutlineInformationCircle } from 'react-icons/hi';
import { useNotifications } from '../../utils/NotificationProvider';

const NotificationPanel = ({ onClose }) => {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    fetchAllNotifications, 
    markAllAsRead 
  } = useNotifications();

  useEffect(() => {
    fetchAllNotifications();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
      style={{ maxHeight: '80vh' }}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
          <span className="text-sm text-gray-500">
            {unreadCount > 0 
              ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
              : 'No new notifications'}
          </span>
        </div>
        {unreadCount > 0 && (
          <Button 
            size="xs" 
            color="light" 
            onClick={markAllAsRead}
            className="flex items-center"
          >
            <HiOutlineCheckCircle className="mr-1" /> Mark all read
          </Button>
        )}
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 120px)' }}>
        <Tabs>
          <Tabs.Item title="All">
            {loading ? (
              <div className="p-8 flex justify-center">
                <Spinner size="md" />
              </div>
            ) : notifications.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {notifications.map(notification => (
                  <NotificationItem 
                    key={notification.notificationId} 
                    notification={notification} 
                  />
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <HiOutlineInformationCircle className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2">No notifications yet</p>
              </div>
            )}
          </Tabs.Item>
          <Tabs.Item title={
            <div className="flex items-center gap-2">
              Unread
              {unreadCount > 0 && (
                <Badge color="failure" className="px-1.5 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
          }>
            {loading ? (
              <div className="p-8 flex justify-center">
                <Spinner size="md" />
              </div>
            ) : notifications.filter(n => !n.isRead).length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {notifications
                  .filter(n => !n.isRead)
                  .map(notification => (
                    <NotificationItem 
                      key={notification.notificationId} 
                      notification={notification} 
                    />
                  ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <HiOutlineCheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2">No unread notifications</p>
              </div>
            )}
          </Tabs.Item>
        </Tabs>
      </div>

      <div className="p-2 border-t border-gray-200 bg-gray-50 text-xs text-center text-gray-500 rounded-b-lg">
        Click a notification to mark it as read
      </div>
    </motion.div>
  );
};

export default NotificationPanel;