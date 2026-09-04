import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { storesApi } from '../services/api';
import { Store } from '../types';

export const Stores: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: stores, isLoading } = useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      const response = await storesApi.getAll();
      return response.data;
    },
  });

  const filteredStores = stores?.filter((store: Store) =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading stores...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Stores</h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search stores by name or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores?.map((store: Store) => (
          <div key={store.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold">{store.name}</h3>
            <p className="text-gray-600">{store.address}</p>
            <div className="mt-4 flex items-center">
              <span className="text-yellow-500 text-xl">⭐</span>
              <span className="ml-2 font-semibold">{store.averageRating?.toFixed(1) || 0}</span>
              <span className="ml-1 text-gray-500">({store.totalRatings || 0} ratings)</span>
            </div>
            <button
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              onClick={() => window.location.href = `/stores/${store.id}`}
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {(!filteredStores || filteredStores.length === 0) && (
        <div className="text-center py-12 text-gray-500">No stores found</div>
      )}
    </div>
  );
};