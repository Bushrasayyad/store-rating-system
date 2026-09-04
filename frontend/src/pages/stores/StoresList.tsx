import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { storesApi } from '../../services/api';
import { Store } from '../../types';
import { FaSearch, FaStar, FaStarHalfAlt } from 'react-icons/fa';

export const StoresList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Store>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const { data, isLoading } = useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      const response = await storesApi.getAll();
      return response.data;
    },
  });

  const handleSort = (field: keyof Store) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredStores = data?.filter((store: Store) =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStores = filteredStores?.sort((a: Store, b: Store) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-yellow-400" />
        ))}
        {hasHalfStar && <FaStarHalfAlt className="text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaStar key={`empty-${i}`} className="text-gray-300" />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Stores</h1>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedStores?.map((store: Store) => (
          <div key={store.id} className="card hover:shadow-lg transition-all duration-200">
            <div className="flex flex-col h-full">
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{store.address}</p>
                <div className="mt-3">{renderStars(store.averageRating)}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {store.totalRatings} ratings
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button
                  className="w-full btn-primary text-center"
                  onClick={() => window.location.href = `/stores/${store.id}`}
                >
                  View Details & Rate
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!sortedStores || sortedStores.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-500">No stores found</p>
        </div>
      )}
    </div>
  );
};