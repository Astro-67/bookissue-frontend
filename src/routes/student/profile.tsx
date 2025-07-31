import { createFileRoute } from '@tanstack/react-router'
import ProfileHeader from '../../features/profile/components/ProfileHeader'
import ProfileForm from '../../features/profile/components/ProfileForm'
import ChangePasswordForm from '../../features/profile/components/ChangePasswordForm'
import { ProfilePictureUpload } from '../../features/profile/components/ProfilePictureUpload'

export const Route = createFileRoute('/student/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <ProfileHeader />

      {/* Profile Picture Upload */}
      <ProfilePictureUpload />

      {/* Profile Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Information */}
        <ProfileForm />

        {/* Change Password */}
        <ChangePasswordForm />
      </div>
    </div>
  )
}
