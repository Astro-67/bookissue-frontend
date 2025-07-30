import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  RiLockLine, 
  RiEyeLine, 
  RiEyeOffLine,
  RiShieldCheckLine
} from 'react-icons/ri';
import { useChangePassword } from '../../../hooks/api';
import type { ChangePasswordData } from '../../../types/api';

// Validation schema
const passwordSchema = z.object({
  old_password: z.string().min(1, 'Current password is required'),
  new_password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  confirm_password: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

const ChangePasswordForm: React.FC = () => {
  const changePassword = useChangePassword();
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid }
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
  });

  const newPassword = watch('new_password');

  const togglePasswordVisibility = (field: 'old' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onSubmit = async (data: PasswordFormData) => {
    try {
      const passwordData: ChangePasswordData = {
        old_password: data.old_password,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      };

      await changePassword.mutateAsync(passwordData);
      reset(); // Clear form after successful change
      setShowPasswords({ old: false, new: false, confirm: false });
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

    const strengths = [
      { score: 0, label: '', color: '' },
      { score: 1, label: 'Very Weak', color: 'bg-red-500' },
      { score: 2, label: 'Weak', color: 'bg-orange-500' },
      { score: 3, label: 'Fair', color: 'bg-yellow-500' },
      { score: 4, label: 'Good', color: 'bg-blue-500' },
      { score: 5, label: 'Strong', color: 'bg-green-500' },
    ];

    return strengths[score];
  };

  const passwordStrength = getPasswordStrength(newPassword || '');

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
          <RiShieldCheckLine className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
          <p className="text-sm text-gray-500">Update your password to keep your account secure</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Current Password */}
        <div>
          <label htmlFor="old_password" className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiLockLine className="w-5 h-5 text-gray-400" />
            </div>
            <input
              {...register('old_password')}
              type={showPasswords.old ? 'text' : 'password'}
              id="old_password"
              className={`block w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.old_password ? 'border-red-300 ring-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your current password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('old')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswords.old ? (
                <RiEyeOffLine className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <RiEyeLine className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.old_password && (
            <p className="mt-1 text-sm text-red-600">{errors.old_password.message}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiLockLine className="w-5 h-5 text-gray-400" />
            </div>
            <input
              {...register('new_password')}
              type={showPasswords.new ? 'text' : 'password'}
              id="new_password"
              className={`block w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.new_password ? 'border-red-300 ring-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswords.new ? (
                <RiEyeOffLine className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <RiEyeLine className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          
          {/* Password strength indicator */}
          {newPassword && (
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
                {passwordStrength.label && (
                  <span className="text-xs font-medium text-gray-600">
                    {passwordStrength.label}
                  </span>
                )}
              </div>
            </div>
          )}
          
          {errors.new_password && (
            <p className="mt-1 text-sm text-red-600">{errors.new_password.message}</p>
          )}
          
          {/* Password requirements */}
          <div className="mt-2 text-xs text-gray-500">
            <p>Password must contain:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li className={newPassword?.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                At least 8 characters
              </li>
              <li className={/[a-z]/.test(newPassword || '') ? 'text-green-600' : 'text-gray-500'}>
                One lowercase letter
              </li>
              <li className={/[A-Z]/.test(newPassword || '') ? 'text-green-600' : 'text-gray-500'}>
                One uppercase letter
              </li>
              <li className={/\d/.test(newPassword || '') ? 'text-green-600' : 'text-gray-500'}>
                One number
              </li>
            </ul>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiLockLine className="w-5 h-5 text-gray-400" />
            </div>
            <input
              {...register('confirm_password')}
              type={showPasswords.confirm ? 'text' : 'password'}
              id="confirm_password"
              className={`block w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.confirm_password ? 'border-red-300 ring-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswords.confirm ? (
                <RiEyeOffLine className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <RiEyeLine className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.confirm_password && (
            <p className="mt-1 text-sm text-red-600">{errors.confirm_password.message}</p>
          )}
        </div>

        {/* Submit button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={!isValid || changePassword.isPending}
            className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {changePassword.isPending ? (
              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <RiShieldCheckLine className="w-4 h-4 mr-2" />
            )}
            {changePassword.isPending ? 'Changing Password...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
