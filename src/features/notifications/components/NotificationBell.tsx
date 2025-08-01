import React, { useState } from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { 
  NotificationIcon, 
  CheckIcon, 
  StatusIcon, 
  CommentIcon, 
  AssignedIcon, 
  SpeakerIcon,
  NewTicketIcon 
} from '../../../ui/Icons';
import { useUnreadCount, useUnreadNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from '../../../hooks/api';
import type { Notification } from '../../../types/api';

// Define the component interface inline to avoid module resolution issues
interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

// Full implementation of NotificationDropdown inline
const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  className = ''
}) => {
  const { data: notifications, isLoading, error } = useUnreadNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const router = useRouter();

  const handleMarkAsRead = async (notificationId: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    await markAsRead.mutateAsync(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead.mutateAsync();
  };

  const getNotificationIcon = (type: Notification['notification_type']) => {
    const iconProps = { className: "h-4 w-4" };
    
    switch (type) {
      case 'ticket_status':
        return <StatusIcon {...iconProps} />;
      case 'new_comment':
        return <CommentIcon {...iconProps} />;
      case 'assignment':
        return <AssignedIcon {...iconProps} />;
      case 'new_ticket':
        return <NewTicketIcon {...iconProps} />;
      default:
        return <SpeakerIcon {...iconProps} />;
    }
  };

  const getNotificationLink = (notification: Notification) => {
    const currentPath = router.state.location.pathname;
    
    // Determine user role from current path
    let userRole = 'staff';
    let ticketPath = 'ticket'; // Default for staff, ict, super-admin
    
    if (currentPath.includes('/ict/')) {
      userRole = 'ict';
    } else if (currentPath.includes('/super-admin/')) {
      userRole = 'super-admin';
    } else if (currentPath.includes('/student/')) {
      userRole = 'student';
      ticketPath = 'tickets'; // Student uses plural "tickets"
    }
    
    if (notification.ticket_id) {
      return `/${userRole}/${ticketPath}/${notification.ticket_id}`;
    }
    return '#';
  };

  const getViewAllNotificationsLink = () => {
    const currentPath = router.state.location.pathname;
    
    // Determine user role from current path
    if (currentPath.includes('/ict/')) {
      return '/ict/notifications';
    } else if (currentPath.includes('/super-admin/')) {
      return '/super-admin/notifications';
    } else if (currentPath.includes('/student/')) {
      return '/student/notifications';
    }
    return '/staff/notifications';
  };

  if (!isOpen) return null;

  return (
    <div className={`w-80 bg-white rounded-xl shadow-xl border border-gray-100 max-h-96 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            Notifications
          </h3>
          {notifications && notifications.length > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={markAllAsRead.isPending}
              className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50 font-medium transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-h-80 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="px-4 py-6 text-center text-sm text-red-600">
            <div>Failed to load notifications</div>
            <div className="text-xs text-gray-500 mt-1">
              {error?.message || 'Unknown error'}
            </div>
          </div>
        ) : !notifications || notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-gray-500">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <NotificationIcon className="h-6 w-6 text-gray-400" />
            </div>
            <p className="font-medium">No new notifications</p>
            <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
            {notifications.map((notification: Notification) => (
              <div
                key={notification.id}
                className="group relative hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
              >
                <Link
                  to={getNotificationLink(notification)}
                  onClick={onClose}
                  className="block px-4 py-3"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 p-1.5 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <div className="text-blue-600">
                        {getNotificationIcon(notification.notification_type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-900">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 font-medium">
                        {notification.time_ago}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                        disabled={markAsRead.isPending}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                        title="Mark as read"
                      >
                        <CheckIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications && notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
          <Link
            to={getViewAllNotificationsLink()}
            onClick={onClose}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            View all notifications →
          </Link>
        </div>
      )}
    </div>
  );
};

interface NotificationBellProps {
  className?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: unreadCount, isLoading } = useUnreadCount();

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className={`relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full ${className}`}
        aria-label="Notifications"
      >
        <NotificationIcon className="h-6 w-6" />
        {!isLoading && unreadCount?.count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center w-4 h-4 text-xs font-semibold text-white bg-red-500 rounded-full shadow-lg ring-2 ring-white">
            {unreadCount.count > 9 ? '9+' : unreadCount.count}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={closeDropdown}
          />
          {/* Dropdown */}
          <NotificationDropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="absolute right-0 mt-2 z-50"
          />
        </>
      )}
    </div>
  );
};

export default NotificationBell;
