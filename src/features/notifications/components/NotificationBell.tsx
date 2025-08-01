import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { NotificationIcon } from '../../../ui/Icons';
import { useUnreadCount, useUnreadNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from '../../../hooks/api';
import { CheckIcon } from '../../../ui/Icons';
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

  const handleMarkAsRead = async (notificationId: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    await markAsRead.mutateAsync(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead.mutateAsync();
  };

  const getNotificationIcon = (type: Notification['notification_type']) => {
    switch (type) {
      case 'ticket_status':
        return '🎫';
      case 'new_comment':
        return '💬';
      case 'assignment':
        return '👤';
      default:
        return '📢';
    }
  };

  const getNotificationLink = (notification: Notification) => {
    if (notification.ticket_id) {
      return `/staff/tickets/${notification.ticket_id}`;
    }
    return '#';
  };

  if (!isOpen) return null;

  return (
    <div className={`w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            Notifications
          </h3>
          {notifications && notifications.length > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={markAllAsRead.isPending}
              className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
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
            Failed to load notifications
          </div>
        ) : !notifications || notifications.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-gray-500">
            No new notifications
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification: Notification) => (
              <div
                key={notification.id}
                className="group relative hover:bg-gray-50 transition-colors"
              >
                <Link
                  to={getNotificationLink(notification)}
                  onClick={onClose}
                  className="block px-4 py-3"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 text-lg">
                      {getNotificationIcon(notification.notification_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.time_ago}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                        disabled={markAsRead.isPending}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-green-600 disabled:opacity-50"
                        title="Mark as read"
                      >
                        <CheckIcon className="h-4 w-4" />
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
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <Link
            to="/staff/notifications"
            onClick={onClose}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View all notifications
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
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full min-w-[20px] h-5">
            {unreadCount.count > 99 ? '99+' : unreadCount.count}
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
