import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storesApi, ratingsApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { FaStar, FaStarHalfAlt, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

export const StoreDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [ratingValue, setRatingValue] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const { data: store, isLoading: storeLoading } = useQuery({
    queryKey: ['store', id],
    queryFn: async () => {
      const response = await storesApi.getOne(id!);
      return response.data;
    },
    enabled: !!id,
  });

  const { data: userRating } = useQuery({
    queryKey: ['user-rating', id],
    queryFn: async () => {
      const response = await ratingsApi.getByUser();
      const userRatings = response.data;
      return userRatings.find((r: any) => r.storeId === id);
    },
    enabled: !!id && !!user,
  });

  const { data: ratingStats } = useQuery({
    queryKey: ['rating-stats', id],
    queryFn: async () => {
      const response = await ratingsApi.getStatistics(id!);
      return response.data;
    },
    enabled: !!id,
  });

  const submitRatingMutation = useMutation({
    mutationFn: (rating: number) => ratingsApi.create({ rating, storeId: id! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store', id] });
      queryClient.invalidateQueries({ queryKey: ['user-rating', id] });
      queryClient.invalidateQueries({ queryKey: ['rating-stats', id] });
      toast.success('Rating submitted successfully!');
      setRatingValue(0);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    },
  });

  const updateRatingMutation = useMutation({
    mutationFn: ({ id: ratingId, rating }: { id: string; rating: number }) =>
      ratingsApi.update(ratingId, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store', id] });
      queryClient.invalidateQueries({ queryKey: ['user-rating', id] });
      queryClient.invalidateQueries({ queryKey: ['rating-stats', id] });
      toast.success('Rating updated successfully!');
      setRatingValue(0);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update rating');
    },
  });

  const handleRatingSubmit = () => {
    if (!user) {
      toast.error('Please login to rate stores');
      return;
    }

    if (ratingValue === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (userRating) {
      updateRatingMutation.mutate({ id: userRating.id, rating: ratingValue });
    } else {
      submitRatingMutation.mutate(ratingValue);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    const sizeClass = size === 'lg' ? 'text-3xl' : 'text-lg';

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className={`${sizeClass} text-yellow-400`} />
        ))}
        {hasHalfStar && <FaStarHalfAlt className={`${sizeClass} text-yellow-400`} />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaStar key={`empty-${i}`} className={`${sizeClass} text-gray-300`} />
        ))}
      </div>
    );
  };

  const renderRatingInput = () => {
    if (!user || user.role !== UserRole.NORMAL) return null;

    return (
      <div className="mt-6 p-6 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-4">
          {userRating ? 'Update your rating' : 'Submit your rating'}
        </h4>
        <div className="flex items-center space-x-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRatingValue(star)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              {(hoveredRating || ratingValue) >= star ? (
                <FaStar className="text-3xl text-yellow-400" />
              ) : (
                <FaStar className="text-3xl text-gray-300" />
              )}
            </button>
          ))}
        </div>
        <button
          onClick={handleRatingSubmit}
          disabled={submitRatingMutation.isPending || updateRatingMutation.isPending}
          className="btn-primary"
        >
          {submitRatingMutation.isPending || updateRatingMutation.isPending
            ? 'Submitting...'
            : userRating
            ? 'Update Rating'
            : 'Submit Rating'}
        </button>
      </div>
    );
  };

  if (storeLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Store not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/stores')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
      >
        <FaArrowLeft />
        <span>Back to stores</span>
      </button>

      <div className="card">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
            <p className="text-gray-600 mt-1">{store.address}</p>
            <p className="text-sm text-gray-500 mt-1">Email: {store.email}</p>
            <p className="text-sm text-gray-500">Owner: {store.owner?.name}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {store.averageRating.toFixed(1)}
              </div>
              {renderStars(store.averageRating, 'lg')}
              <div className="text-sm text-gray-500 mt-1">
                {store.totalRatings} ratings
              </div>
            </div>
          </div>
        </div>
      </div>

      {ratingStats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((star) => {
            const count = ratingStats.ratingDistribution[star as keyof typeof ratingStats.ratingDistribution] || 0;
            const percentage = ratingStats.totalRatings > 0
              ? (count / ratingStats.totalRatings) * 100
              : 0;
            return (
              <div key={star} className="card">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{star} ★</span>
                  <span className="text-sm text-gray-500">{count}</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 rounded-full h-2 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {renderRatingInput()}
    </div>
  );
};