import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { storesApi, ratingsApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FaStar, FaUsers, FaChartBar } from 'react-icons/fa';

export const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();

  const { data: stores, isLoading: storesLoading } = useQuery({
    queryKey: ['owner-stores'],
    queryFn: async () => {
      const response = await storesApi.getAll();
      return response.data.filter((store: any) => store.ownerId === user?.id);
    },
    enabled: !!user,
  });

  const store = stores?.[0];

  const { data: ratingStats } = useQuery({
    queryKey: ['owner-rating-stats', store?.id],
    queryFn: async () => {
      const response = await ratingsApi.getStatistics(store?.id);
      return response.data;
    },
    enabled: !!store?.id,
  });

  if (storesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">You don't own any stores yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Store Owner Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <FaStore className="text-2xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Your Store</p>
              <p className="text-lg font-semibold text-gray-900">{store.name}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg text-yellow-600">
              <FaStar className="text-2xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {store.averageRating.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg text-green-600">
              <FaUsers className="text-2xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Ratings</p>
              <p className="text-2xl font-bold text-gray-900">{store.totalRatings}</p>
            </div>
          </div>
        </div>
      </div>

      {ratingStats && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((star) => {
              const count = ratingStats.ratingDistribution[star as keyof typeof ratingStats.ratingDistribution] || 0;
              const percentage = ratingStats.totalRatings > 0
                ? (count / ratingStats.totalRatings) * 100
                : 0;
              return (
                <div key={star}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{star} ★</span>
                    <span className="text-gray-500">{count} ratings</span>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};