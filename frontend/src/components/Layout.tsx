import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { FaStore, FaUsers, FaStar, FaSignOutAlt, FaUser, FaChartBar } from 'react-icons/fa';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === UserRole.ADMIN;
  const isStoreOwner = user?.role === UserRole.STORE_OWNER;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <FaStore className="text-primary-600 text-2xl" />
                <span className="text-xl font-bold text-gray-900">StoreRating</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {isAdmin && (
                <Link to="/admin/dashboard" className="text-gray-700 hover:text-primary-600">
                  <FaChartBar className="text-lg" />
                </Link>
              )}
              
              {isStoreOwner && (
                <Link to="/owner/dashboard" className="text-gray-700 hover:text-primary-600">
                  <FaChartBar className="text-lg" />
                </Link>
              )}

              <div className="flex items-center space-x-2">
                <FaUser className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                <span className="text-xs text-gray-500">({user?.role})</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
              >
                <FaSignOutAlt />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};