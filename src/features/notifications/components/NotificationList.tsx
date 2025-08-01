import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { 
  useNotifications, 
  useMarkNotificationAsRead, 
  useMarkAllNotificationsAsRead,
  useDeleteNotification 
} from '../../../hooks/api';
import { CheckIcon, TrashIcon } from '../../../ui/Icons';
import type { Notification } from '../../../types/api';
import Button from '../../../ui/Button';

interface NotificationListProps {
  showReadNotifications?: boolean;
  pageSize?: number;
}

const NotificationList: React.FC<NotificationListProps> = ({
  showReadNotifications = false,
  pageSize = 20
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState<string>('');

  const { 
    data: notificationsData, 
    isLoading, 
    error 
  } = useNotifications({
    is_read: showReadNotifications ? undefined : false,
    notification_type: filterType || undefined,
    page: currentPage,
    page_size: pageSize
  });

  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const deleteNotification = useDeleteNotification();

  const handleMarkAsRead = async (notificationId: number) => {
    await markAsRead.mutateAsync(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead.mutateAsync();
  };

  const handleDelete = async (notificationId: number) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      await deleteNotification.mutateAsync(notificationId);
    }
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

  const getNotificationBadgeColor = (type: Notification['notification_type']) => {
    switch (type) {
      case 'ticket_status':
        return 'bg-blue-100 text-blue-800';
      case 'new_comment':
        return 'bg-green-100 text-green-800';
      case 'assignment':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNotificationLink = (notification: Notification) => {
    if (notification.ticket_id) {
      return `/staff/tickets/${notification.ticket_id}`;
    }
    return '#';
  };

  const notifications = notificationsData?.results || [];
  const totalPages = notificationsData ? Math.ceil(notificationsData.count / pageSize) : 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        {notifications.length > 0 && (
          <Button
            onClick={handleMarkAllAsRead}
            disabled={markAllAsRead.isPending}
            variant="secondary"
            size="sm"
          >
            Mark All Read
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="ticket_status">Ticket Status</option>
          <option value="new_comment">New Comments</option>
          <option value="assignment">Assignments</option>
          <option value="general">General</option>
        </select>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">Failed to load notifications</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔕</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No notifications yet
          </h3>
          <p className="text-gray-600">
            {showReadNotifications 
              ? "You don't have any read notifications."
              : "You're all caught up! New notifications will appear here."
            }
          </p>
        </div>
      ) : (
        <>
          {/* Notification List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {notifications.map((notification: Notification) => (
                <li
                  key={notification.id}
                  className={`group relative ${
                    !notification.is_read ? 'bg-blue-50' : 'bg-white'
                  } hover:bg-gray-50 transition-colors`}
                >
                  <div className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-shrink-0 text-2xl">
                          {getNotificationIcon(notification.notification_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getNotificationBadgeColor(
                                notification.notification_type
                              )}`}
                            >
                              {notification.notification_type.replace('_', ' ')}
                            </span>
                            {!notification.is_read && (
                              <span className="inline-flex h-2 w-2 rounded-full bg-blue-600" />
                            )}
                          </div>
                          <Link
                            to={getNotificationLink(notification)}
                            className="block group-hover:text-blue-600 transition-colors"
                          >
                            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 truncate">
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                          </Link>
                          <p className="text-xs text-gray-400 mt-2">
                            {notification.time_ago}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.is_read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            disabled={markAsRead.isPending}
                            className="p-2 text-gray-400 hover:text-green-600 transition-colors disabled:opacity-50"
                            title="Mark as read"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          disabled={deleteNotification.isPending}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Delete notification"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="secondary"
                  size="sm"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="secondary"
                  size="sm"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NotificationList;
