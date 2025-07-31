import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { 
  RiUser3Line, 
  RiMailLine, 
  RiPhoneLine, 
  RiSaveLine
} from 'react-icons/ri';
import { useCurrentUser, useUpdateProfileSilent, useUploadProfilePictureSilent, useDeleteProfilePictureSilent } from '../../../hooks/api';
import { ProfilePictureUpload } from './ProfilePictureUpload';
import type { UpdateProfileData } from '../../../types/api';

// Validation schema
const profileSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  last_name: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  phone_number: z.string().optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfileForm: React.FC = () => {
  const { data: user, isLoading } = useCurrentUser();
  const updateProfile = useUpdateProfileSilent();
  const uploadProfilePicture = useUploadProfilePictureSilent();
  const deleteProfilePicture = useDeleteProfilePictureSilent();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProfilePicture, setSelectedProfilePicture] = useState<File | null>(null);
  const [shouldDeleteProfilePicture, setShouldDeleteProfilePicture] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: user ? {
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone_number: user.phone_number || '',
    } : {},
  });

  // Reset form when user data loads
  React.useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone_number: user.phone_number || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Update profile data
      const updateData: UpdateProfileData = {
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number || undefined,
      };

      await updateProfile.mutateAsync(updateData);

      // Delete profile picture if requested
      if (shouldDeleteProfilePicture) {
        await deleteProfilePicture.mutateAsync();
        setShouldDeleteProfilePicture(false);
      }

      // Upload profile picture if selected
      if (selectedProfilePicture) {
        await uploadProfilePicture.mutateAsync(selectedProfilePicture);
        setSelectedProfilePicture(null);
      }

      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      // Error is handled by the mutation hooks
    }
  };

  const handleCancel = () => {
    reset();
    setSelectedProfilePicture(null);
    setShouldDeleteProfilePicture(false);
    setIsEditing(false);
  };

  const handleDeleteProfilePicture = () => {
    setShouldDeleteProfilePicture(true);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-500">Unable to load profile data.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
          >
            <RiUser3Line className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information Fields */}
        <div className="space-y-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
            <RiUser3Line className="w-4 h-4 mr-2" />
            Personal Details
          </h3>

          {/* Profile Picture Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            {isEditing ? (
              <div className="space-y-2">
                <ProfilePictureUpload 
                  onFileSelect={setSelectedProfilePicture}
                  currentProfilePicture={user?.profile_picture_url || user?.profile_picture}
                  onDelete={handleDeleteProfilePicture}
                  isEditing={isEditing}
                />
                {selectedProfilePicture && (
                  <p className="text-sm text-green-600">
                    Selected: {selectedProfilePicture.name}
                  </p>
                )}
                {shouldDeleteProfilePicture && (
                  <p className="text-sm text-orange-600">
                    Current profile picture will be removed when you save changes.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="file"
                  disabled
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-500 hover:file:bg-gray-50 border border-gray-200 bg-gray-50 rounded-md cursor-not-allowed"
                />
                <p className="text-xs text-gray-500">
                  {user.profile_picture_url 
                    ? 'Profile picture uploaded' 
                    : 'No profile picture uploaded'
                  }
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <RiUser3Line className="w-5 h-5 text-gray-400" />
              </div>
              <input
                {...register('first_name')}
                type="text"
                id="first_name"
                disabled={!isEditing}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  isEditing 
                    ? 'border-gray-300 bg-white' 
                    : 'border-gray-200 bg-gray-50 text-gray-600'
                } ${errors.first_name ? 'border-red-300 ring-red-500' : ''}`}
                placeholder="Enter your first name"
              />
            </div>
            {errors.first_name && (
              <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <RiUser3Line className="w-5 h-5 text-gray-400" />
              </div>
              <input
                {...register('last_name')}
                type="text"
                id="last_name"
                disabled={!isEditing}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  isEditing 
                    ? 'border-gray-300 bg-white' 
                    : 'border-gray-200 bg-gray-50 text-gray-600'
                } ${errors.last_name ? 'border-red-300 ring-red-500' : ''}`}
                placeholder="Enter your last name"
              />
            </div>
            {errors.last_name && (
              <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        {/* Email - Always Read-only */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-gray-400">(Read-only)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiMailLine className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              value={user.email || ''}
              readOnly
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 bg-gray-50 text-gray-600 rounded-lg cursor-not-allowed"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Email cannot be changed from this form</p>
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-gray-400">(Optional)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiPhoneLine className="w-5 h-5 text-gray-400" />
            </div>
            <input
              {...register('phone_number')}
              type="tel"
              id="phone_number"
              disabled={!isEditing}
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                isEditing 
                  ? 'border-gray-300 bg-white' 
                  : 'border-gray-200 bg-gray-50 text-gray-600'
              } ${errors.phone_number ? 'border-red-300 ring-red-500' : ''}`}
              placeholder="Enter your phone number"
            />
          </div>
          {errors.phone_number && (
            <p className="mt-1 text-sm text-red-600">{errors.phone_number.message}</p>
          )}
        </div>
        </div>

        {/* Read-only System Information */}
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            System Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
              <input
                type="text"
                value={user.student_id || 'Not assigned'}
                readOnly
                className="block w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-600 rounded-lg cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <input
                type="text"
                value={user.role?.toUpperCase() || 'STUDENT'}
                readOnly
                className="block w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-600 rounded-lg cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {isEditing && (
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={(!isDirty && !selectedProfilePicture && !shouldDeleteProfilePicture) || updateProfile.isPending || uploadProfilePicture.isPending || deleteProfilePicture.isPending}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {updateProfile.isPending || uploadProfilePicture.isPending || deleteProfilePicture.isPending ? (
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <RiSaveLine className="w-4 h-4 mr-2" />
              )}
              {updateProfile.isPending || uploadProfilePicture.isPending || deleteProfilePicture.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileForm;
