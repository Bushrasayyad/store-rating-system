import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, storesApi } from '../../services/api';
import { User, Store, UserRole } from '../../types';
import {
  FaUsers,
  FaStore,
  FaStar,
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
} from 'react-icons/fa';
import { Modal } from '../../components/Modal';
import toast from 'react-hot-toast';

export const AdminDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'users' | 'stores'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: UserRole.NORMAL,
    ownerId: '',
  });

  // Fetch statistics
  const { data: userStats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const response = await usersApi.getStatistics();
      return response.data;
    },
  });

  const { data: storeStats } = useQuery({
    queryKey: ['store-stats'],
    queryFn: async () => {
      const response = await storesApi.getStatistics();
      return response.data;
    },
  });

  // Fetch users
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users', searchTerm],
    queryFn: async () => {
      const params = searchTerm ? { name: searchTerm, email: searchTerm, address: searchTerm } : {};
      const response = await usersApi.getAll(params);
      return response.data;
    },
  });

  // Fetch stores
  const { data: stores, isLoading: storesLoading } = useQuery({
    queryKey: ['stores', searchTerm],
    queryFn: async () => {
      const params = searchTerm ? { name: searchTerm, email: searchTerm, address: searchTerm } : {};
      const response = await storesApi.getAll(params);
      return response.data;
    },
  });

  // Mutations
  const createUserMutation = useMutation({
    mutationFn: (data: any) => usersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      toast.success('User created successfully');
      handleCloseModal();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create user');
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => usersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully');
      handleCloseModal();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update user');
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    },
  });

  const createStoreMutation = useMutation({
    mutationFn: (data: any) => storesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      queryClient.invalidateQueries({ queryKey: ['store-stats'] });
      toast.success('Store created successfully');
      handleCloseModal();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create store');
    },
  });

  const updateStoreMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => storesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast.success('Store updated successfully');
      handleCloseModal();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update store');
    },
  });

  const deleteStoreMutation = useMutation({
    mutationFn: (id: string) => storesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      queryClient.invalidateQueries({ queryKey: ['store-stats'] });
      toast.success('Store deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete store');
    },
  });

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name || '',
        email: item.email || '',
        address: item.address || '',
        password: '',
        role: item.role || UserRole.NORMAL,
        ownerId: item.ownerId || '',
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        email: '',
        address: '',
        password: '',
        role: UserRole.NORMAL,
        ownerId: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = () => {
    if (activeTab === 'users') {
      if (editingItem) {
        updateUserMutation.mutate({ id: editingItem.id, data: formData });
      } else {
        createUserMutation.mutate(formData);
      }
    } else {
      if (editingItem) {
        updateStoreMutation.mutate({ id: editingItem.id, data: formData });
      } else {
        createStoreMutation.mutate(formData);
      }
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      if (activeTab === 'users') {
        deleteUserMutation.mutate(id);
      } else {
        deleteStoreMutation.mutate(id);
      }
    }
  };

  const renderSortIcon = (field: string) => {
    if (field !== sortField) return <FaSort className="text-gray-400" />;
    return sortDirection === 'asc' ? (
      <FaSortUp className="text-primary-600" />
    ) : (
      <FaSortDown className="text-primary-600" />
    );
  };

  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="card">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
            <FaUsers className="text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{userStats?.totalUsers || 0}</p>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-green-100 rounded-lg text-green-600">
            <FaStore className="text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Stores</p>
            <p className="text-2xl font-bold text-gray-900">{storeStats?.totalStores || 0}</p>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-yellow-100 rounded-lg text-yellow-600">
            <FaStar className="text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Stores with Ratings</p>
            <p className="text-2xl font-bold text-gray-900">{storeStats?.storesWithRatings || 0}</p>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
            <FaUserPlus className="text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Admin Users</p>
            <p className="text-2xl font-bold text-gray-900">{userStats?.adminUsers || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsersTable = () => {
    const filteredUsers = users?.filter((user: User) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedUsers = filteredUsers?.sort((a: User, b: User) => {
      const aVal = a[sortField as keyof User];
      const bVal = b[sortField as keyof User];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return 0;
    });

    return (
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Users</h2>
          <button onClick={() => handleOpenModal()} className="btn-primary flex items-center space-x-2">
            <FaUserPlus />
            <span>Add User</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center space-x-1 hover:text-gray-900"
                  >
                    <span>Name</span>
                    {renderSortIcon('name')}
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  <button
                    onClick={() => handleSort('email')}
                    className="flex items-center space-x-1 hover:text-gray-900"
                  >
                    <span>Email</span>
                    {renderSortIcon('email')}
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  <button
                    onClick={() => handleSort('address')}
                    className="flex items-center space-x-1 hover:text-gray-900"
                  >
                    <span>Address</span>
                    {renderSortIcon('address')}
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Role</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers?.map((user: User) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{user.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{user.address}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`badge ${
                        user.role === UserRole.ADMIN
                          ? 'badge-admin'
                          : user.role === UserRole.STORE_OWNER
                          ? 'badge-store-owner'
                          : 'badge-normal'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="text-gray-500 hover:text-primary-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderStoresTable = () => {
    const filteredStores = stores?.filter((store: Store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedStores = filteredStores?.sort((a: Store, b: Store) => {
      const aVal = a[sortField as keyof Store];
      const bVal = b[sortField as keyof Store];
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

    return (
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Stores</h2>
          <button onClick={() => handleOpenModal()} className="btn-primary flex items-center space-x-2">
            <FaStore />
            <span>Add Store</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center space-x-1 hover:text-gray-900"
                  >
                    <span>Name</span>
                    {renderSortIcon('name')}
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  <button
                    onClick={() => handleSort('email')}
                    className="flex items-center space-x-1 hover:text-gray-900"
                  >
                    <span>Email</span>
                    {renderSortIcon('email')}
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  <button
                    onClick={() => handleSort('address')}
                    className="flex items-center space-x-1 hover:text-gray-900"
                  >
                    <span>Address</span>
                    {renderSortIcon('address')}
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Rating</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedStores?.map((store: Store) => (
                <tr key={store.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{store.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{store.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{store.address}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <FaStar className="text-yellow-400 text-sm" />
                      <span>{store.averageRating.toFixed(1)}</span>
                      <span className="text-gray-400 text-xs">({store.totalRatings})</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenModal(store)}
                        className="text-gray-500 hover:text-primary-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(store.id)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      {renderStats()}

      <div className="flex items-center space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'users'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center space-x-2">
            <FaUsers />
            <span>Users</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('stores')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'stores'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center space-x-2">
            <FaStore />
            <span>Stores</span>
          </div>
        </button>
      </div>

      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
        />
      </div>

      {activeTab === 'users' ? renderUsersTable() : renderStoresTable()}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? 'Edit Item' : `Add New ${activeTab === 'users' ? 'User' : 'Store'}`}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 input-field"
              required
              minLength={20}
              maxLength={60}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="mt-1 input-field"
              required
              maxLength={400}
            />
          </div>
          {activeTab === 'users' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mt-1 input-field"
                  required={!editingItem}
                  minLength={8}
                  maxLength={16}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Must contain at least one uppercase letter and one special character
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="mt-1 input-field"
                >
                  <option value={UserRole.NORMAL}>Normal User</option>
                  <option value={UserRole.ADMIN}>Admin</option>
                  <option value={UserRole.STORE_OWNER}>Store Owner</option>
                </select>
              </div>
            </>
          )}
          {activeTab === 'stores' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Owner ID</label>
              <input
                type="text"
                value={formData.ownerId}
                onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
                className="mt-1 input-field"
                required
              />
            </div>
          )}
          <div className="flex items-center space-x-4 pt-4">
            <button type="submit" className="btn-primary flex-1">
              {editingItem ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={handleCloseModal} className="btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};