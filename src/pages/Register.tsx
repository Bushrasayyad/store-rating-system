import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import toast from 'react-hot-toast';

interface RegisterForm {
  name: string;
  email: string;
  address: string;
  password: string;
  confirmPassword: string;
}

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    try {
      await authApi.register(data);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              {...register('name')}
              type="text"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              {...register('email')}
              type="email"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              {...register('address')}
              type="text"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Your address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              {...register('password')}
              type="password"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              {...register('confirmPassword')}
              type="password"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};