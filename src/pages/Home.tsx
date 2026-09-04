import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome, {user?.name || 'Guest'}! 🎉
        </h1>
        <p className="text-gray-600 mb-6">
          You are logged in as <span className="font-semibold text-blue-600">{user?.role}</span>
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <Link to="/stores" className="bg-blue-50 p-6 rounded-lg hover:bg-blue-100 transition">
            <div className="text-3xl mb-2">🏪</div>
            <h3 className="font-semibold">View Stores</h3>
            <p className="text-sm text-gray-600">Browse all registered stores</p>
          </Link>
          
          {user?.role === UserRole.ADMIN && (
            <Link to="/admin" className="bg-purple-50 p-6 rounded-lg hover:bg-purple-100 transition">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold">Admin Dashboard</h3>
              <p className="text-sm text-gray-600">Manage users and stores</p>
            </Link>
          )}
          
          {user?.role === UserRole.STORE_OWNER && (
            <Link to="/owner" className="bg-green-50 p-6 rounded-lg hover:bg-green-100 transition">
              <div className="text-3xl mb-2">📈</div>
              <h3 className="font-semibold">Store Dashboard</h3>
              <p className="text-sm text-gray-600">View your store statistics</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};