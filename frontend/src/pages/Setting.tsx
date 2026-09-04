import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { usersApi } from '../services/api';
import toast from 'react-hot-toast';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must be at most 16 characters')
    .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/, 
      'Password must contain at least one uppercase letter and one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await usersApi.updatePassword(user.id, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password updated successfully!');
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              {...register('currentPassword')}
              type="password"
              className="mt-1 input-field"
              placeholder="Enter current password"
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              {...register('newPassword')}
              type="password"
              className="mt-1 input-field"
              placeholder="Enter new password"
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              {...register('confirmPassword')}
              type="password"
              className="mt-1 input-field"
              placeholder="Confirm new password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-gray-900">{user?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-gray-900">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Address</p>
            <p className="text-gray-900">{user?.address}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="text-gray-900 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};