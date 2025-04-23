import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Avatar } from 'flowbite-react';
import { 
  HiOutlineBell,
  HiOutlineUserAdd, 
  HiOutlineChatAlt, 
  HiOutlineBadgeCheck,
  HiOutlineGlobeAlt,
  HiOutlineLightningBolt
} from 'react-icons/hi';
import { useNotifications } from '../../utils/NotificationProvider';

const NotificationItem = ({ notification }) => {
  const { markAsRead } = useNotifications();

  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead(notification.notificationId);
    }
    
    // Implement navigation or action based on notification type
    // e.g., navigate to a specific page or show more details
  };

  // Format the creation time as "X minutes/hours/days ago"
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });

  // Select icon based on notification type
  const getIcon = () => {
    switch (notification.notificationType) {
      case 'LIKE':
        return <HiOutlineUserAdd className="text-blue-500" />;
      case 'COMMENT':
        return <HiOutlineChatAlt className="text-green-500" />;
      case 'POST':
        return <HiOutlineBadgeCheck className="text-purple-500" />;
      case 'FOLLOW':
        return <HiOutlineGlobeAlt className="text-gray-500" />;
      case 'SKILL_UPDATE':
        return <HiOutlineLightningBolt className="text-yellow-500" />;
      default:
        return <HiOutlineBell className="text-blue-500" />;
    }
  };

  return (
    <motion.li
      initial={{ backgroundColor: notification.isRead ? '#ffffff' : '#EFF6FF' }}
      animate={{ backgroundColor: notification.isRead ? '#ffffff' : '#EFF6FF' }}
      whileHover={{ backgroundColor: '#F9FAFB' }}
      onClick={handleClick}
      className="cursor-pointer transition-colors duration-200"
    >
      <div className="flex items-start p-3 sm:p-4">
        <div className="flex-shrink-0 mr-3">
          {notification.senderUserId ? (
            <Avatar 
              size="sm" 
              rounded 
              img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" 
              alt={notification.senderUserName || 'User'} 
            />
          ) : (
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100">
              {getIcon()}
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 line-clamp-2">{notification.message}</p>
          
          <div className="flex items-center mt-1 space-x-2">
            {notification.senderUserName && (
              <span className="text-xs font-medium text-blue-600">
                {notification.senderUserName}
              </span>
            )}
            <span className="text-xs text-gray-500">
              {timeAgo}
            </span>
          </div>
        </div>
        
        {!notification.isRead && (
          <div className="flex-shrink-0 ml-2">
            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
          </div>
        )}
      </div>
    </motion.li>
  );
};

export default NotificationItem;