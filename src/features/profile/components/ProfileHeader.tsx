import React from 'react';
import { 
  RiUser3Line, 
  RiCalendarLine, 
  RiShieldUserLine,
  RiVerifiedBadgeLine
} from 'react-icons/ri';
import { useCurrentUser } from '../../../hooks/api';
import { getMediaUrl } from '../../../utils/media';

const ProfileHeader: React.FC = () => {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
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

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0]?.toUpperCase() || ''}${lastName?.[0]?.toUpperCase() || ''}`;
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'student':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'staff':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ict':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'super_admin':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'student':
        return 'Student';
      case 'staff':
        return 'Staff Member';
      case 'ict':
        return 'ICT Admin';
      case 'super_admin':
        return 'Super Admin';
      default:
        return role || 'Unknown';
    }
  };  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm p-6 border border-blue-100">
      <div className="flex items-center space-x-6">
        {/* Avatar */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            {user.profile_picture_url ? (
              <img
                src={getMediaUrl(user.profile_picture_url) || ''}
                alt={`${user.first_name} ${user.last_name}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // If image fails to load, hide it and show initials
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center">
                        <span class="text-2xl font-bold text-white">
                          ${getInitials(user.first_name, user.last_name)}
                        </span>
                      </div>
                    `;
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {getInitials(user.first_name, user.last_name)}
                </span>
              </div>
            )}
          </div>
          {user.is_active && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <RiVerifiedBadgeLine className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {user.full_name || `${user.first_name} ${user.last_name}`}
            </h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
              <RiShieldUserLine className="w-3 h-3 mr-1" />
              {getRoleDisplayName(user.role)}
            </span>
          </div>
          
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <RiUser3Line className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
            
            {user.student_id && (
              <div className="flex items-center space-x-2">
                <RiVerifiedBadgeLine className="w-4 h-4" />
                <span>Student ID: {user.student_id}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <RiCalendarLine className="w-4 h-4" />
              <span>Member since {formatDate(user.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex flex-col items-center space-y-2">
          <div className={`w-3 h-3 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span className={`text-xs font-medium ${user.is_active ? 'text-green-600' : 'text-gray-500'}`}>
            {user.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
