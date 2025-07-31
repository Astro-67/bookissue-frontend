import { createFileRoute } from '@tanstack/react-router';
import ProfileHeader from '../../features/profile/components/ProfileHeader';
import ProfileForm from '../../features/profile/components/ProfileForm';
import ChangePasswordForm from '../../features/profile/components/ChangePasswordForm';

function ICTProfile() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Profile Header */}
      <ProfileHeader />

      {/* Profile Form */}
      <ProfileForm />

      {/* Change Password Form */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Change Password</h2>
          <p className="text-sm text-gray-500">Update your password to keep your account secure</p>
        </div>
        <div className="px-6 py-6">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/ict/profile')({
  component: ICTProfile,
});
