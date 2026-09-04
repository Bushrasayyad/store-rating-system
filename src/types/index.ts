export enum UserRole {
  ADMIN = 'admin',
  STORE_OWNER = 'store_owner',
  NORMAL = 'normal',
}

export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  averageRating: number;
  totalRatings: number;
  ownerId: string;
  owner?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  id: string;
  rating: number;
  userId: string;
  storeId: string;
  user?: User;
  store?: Store;
  createdAt: string;
  updatedAt: string;
}