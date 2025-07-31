import { createFileRoute } from '@tanstack/react-router';
import ProfileHeader from '../../features/profile/components/ProfileHeader';
import ProfileForm from '../../features/profile/components/ProfileForm';
import ChangePasswordForm from '../../features/profile/components/ChangePasswordForm';

function StaffProfile() {
  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <ProfileHeader />

      {/* Profile Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Information */}
        <ProfileForm />

        {/* Change Password */}
        <ChangePasswordForm />
      </div>
    </div>
  );
}

export const Route = createFileRoute('/staff/profile')({
  component: StaffProfile,
});
