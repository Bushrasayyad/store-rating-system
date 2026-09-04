import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { FaStore, FaUsers, FaStar, FaChartBar } from 'react-icons/fa';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const getDashboardLink = () => {
    if (user.role === UserRole.ADMIN) return '/admin/dashboard';
    if (user.role === UserRole.STORE_OWNER) return '/owner/dashboard';
    return '/stores';
  };

  const quickActions = [
    {
      title: 'View Stores',
      description: 'Browse all registered stores',
      icon: FaStore,
      path: '/stores',
      color: 'bg-blue-500',
    },
    ...(user.role === UserRole.ADMIN ? [{
      title: 'Admin Dashboard',
      description: 'Manage users, stores, and view statistics',
      icon: FaChartBar,
      path: '/admin/dashboard',
      color: 'bg-purple-500',
    }] : []),
    ...(user.role === UserRole.STORE_OWNER ? [{
      title: 'Store Dashboard',
      description: 'View your store ratings and users',
      icon: FaChartBar,
      path: '/owner/dashboard',
      color: 'bg-green-500',
    }] : []),
    ...(user.role === UserRole.NORMAL ? [{
      title: 'Rate Stores',
      description: 'Submit and manage your ratings',
      icon: FaStar,
      path: '/stores',
      color: 'bg-yellow-500',
    }] : []),
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.name}!
        </h1>
        <p className="mt-2 text-gray-600">
          You are logged in as a <span className="font-medium text-primary-600">{user.role}</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Email: {user.email} | Address: {user.address}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <button
            key={action.title}
            onClick={() => navigate(action.path)}
            className="card text-left hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${action.color} text-white`}>
                <action.icon className="text-2xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{action.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{action.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};