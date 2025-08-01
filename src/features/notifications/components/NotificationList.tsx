import React, { useState } from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { 
  useNotifications, 
  useMarkNotificationAsRead, 
  useMarkAllNotificationsAsRead,
  useDeleteNotification 
} from '../../../hooks/api';
import { 
  CheckIcon, 
  TrashIcon, 
  StatusIcon, 
  CommentIcon, 
  AssignedIcon, 
  SpeakerIcon, 
  BellSlashIcon,
  NewTicketIcon 
} from '../../../ui/Icons';
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
  const router = useRouter();

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
    const iconProps = { className: "h-5 w-5" };
    
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

  const getNotificationBadgeColor = (type: Notification['notification_type']) => {
    switch (type) {
      case 'ticket_status':
        return 'bg-green-100 text-green-700 border border-green-200';
      case 'new_comment':
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'assignment':
        return 'bg-purple-100 text-purple-700 border border-purple-200';
      case 'new_ticket':
        return 'bg-orange-100 text-orange-700 border border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
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

  const notifications = notificationsData?.results || [];
  const totalPages = notificationsData ? Math.ceil(notificationsData.count / pageSize) : 1;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-600 mt-1">
            {showReadNotifications ? 'Read notifications' : 'Recent notifications and updates'}
          </p>
        </div>
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">Filter notifications</h3>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          >
            <option value="">All Types</option>
            <option value="ticket_status">Status Updates</option>
            <option value="new_comment">Comments</option>
            <option value="assignment">Assignments</option>
            <option value="new_ticket">New Tickets</option>
            <option value="general">General</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 text-center py-16">
          <div className="text-red-600">
            <p className="font-medium">Failed to load notifications</p>
            <p className="text-sm mt-1">Please try refreshing the page</p>
          </div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
              <BellSlashIcon className="h-10 w-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              No notifications yet
            </h3>
            <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
              {showReadNotifications 
                ? "You don't have any read notifications. Once you mark notifications as read, they'll appear here."
                : "You're all caught up! New notifications will appear here when you receive them."
              }
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Notification List */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
            <div className="divide-y divide-gray-100">
              {notifications.map((notification: Notification) => (
                <div
                  key={notification.id}
                  className={`group relative transition-all duration-200 hover:shadow-sm ${
                    !notification.is_read 
                      ? 'bg-gradient-to-r from-blue-50 via-blue-25 to-white border-l-4 border-l-blue-400' 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="px-6 py-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1 min-w-0">
                        {/* Icon Container */}
                        <div className={`flex-shrink-0 p-3 rounded-xl transition-all duration-200 ${
                          !notification.is_read 
                            ? 'bg-white shadow-md border border-gray-200 group-hover:shadow-lg' 
                            : 'bg-gray-100 group-hover:bg-gray-200'
                        }`}>
                          <div className={`transition-colors duration-200 ${
                            !notification.is_read ? 'text-blue-600' : 'text-gray-500'
                          }`}>
                            {getNotificationIcon(notification.notification_type)}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Badge and Status */}
                          <div className="flex items-center space-x-3 mb-3">
                            <span
                              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${getNotificationBadgeColor(
                                notification.notification_type
                              )}`}
                            >
                              {notification.notification_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                            {!notification.is_read && (
                              <div className="flex items-center space-x-2">
                                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-xs font-medium text-blue-600">New</span>
                              </div>
                            )}
                          </div>

                          {/* Notification Content */}
                          <Link
                            to={getNotificationLink(notification)}
                            className="block group-hover:text-blue-600 transition-colors"
                          >
                            <h3 className={`text-base font-semibold truncate transition-colors mb-2 ${
                              !notification.is_read 
                                ? 'text-gray-900 group-hover:text-blue-600' 
                                : 'text-gray-700 group-hover:text-blue-600'
                            }`}>
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3">
                              {notification.message}
                            </p>
                          </Link>

                          {/* Timestamp */}
                          <p className="text-xs text-gray-400 font-medium">
                            {notification.time_ago}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-start space-x-1 ml-4 flex-shrink-0">
                        {!notification.is_read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            disabled={markAsRead.isPending}
                            className="p-2.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 disabled:opacity-50 tooltip"
                            title="Mark as read"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          disabled={deleteNotification.isPending}
                          className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                          title="Delete notification"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Page {currentPage}</span> of <span className="font-medium">{totalPages}</span>
                  <span className="text-gray-500 ml-2">
                    ({notificationsData?.count || 0} total notifications)
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="secondary"
                    size="sm"
                  >
                    ← Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="secondary"
                    size="sm"
                  >
                    Next →
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NotificationList;
