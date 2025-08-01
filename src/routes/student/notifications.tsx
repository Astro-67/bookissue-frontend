import { createFileRoute } from '@tanstack/react-router';
import { NotificationList } from '../../features/notifications/components';

export const Route = createFileRoute('/student/notifications')({
  component: NotificationsPage,
});

function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <NotificationList />
        </div>
      </div>
    </div>
  );
}
