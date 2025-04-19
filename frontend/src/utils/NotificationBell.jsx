import React, { useState, useRef, useEffect } from 'react';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { useNotifications } from './NotificationProvider';
import NotificationPanel from '../components/shared/NotificationPanel';


const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useNotifications();
  const bellRef = useRef(null);
  
  // Close notification panel when clicking outside
  useOnClickOutside(bellRef, () => setIsOpen(false));
  
  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-300"
        aria-label="Notifications"
      >
        <IoMdNotificationsOutline className="text-2xl" />
        
        {/* Notification badge */}
        {unreadCount > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </button>
      
      {/* Notification panel */}
      <AnimatePresence>
        {isOpen && (
          <NotificationPanel onClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;