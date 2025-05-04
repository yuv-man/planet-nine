import React, {
  createContext,
  useContext,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { userAPI } from './api';
import { User } from '../types/types';

interface FavoriteUsersContextValue {
  favoriteUsers: Record<number, User>;
  addFavorite: (user: User) => Promise<void>;
  removeFavorite: (user: User) => Promise<void>;
  isFavorite: (userId: number) => boolean;
  summary: Record<string, any>;
}

const FavoriteUsersContext = createContext<FavoriteUsersContextValue | undefined>(undefined);

export function FavoriteUsersProvider({ children }: { children: ReactNode }) {
  const [favoriteUsers, setFavoriteUsers] = useState<Record<number, User>>({});
  const [summary, setSummary] = useState<Record<string, any>>({});

  const addFavorite = async (user: User): Promise<void> => {
    try {
      const { summary, users } = await userAPI.setFavoriteUsers(user, favoriteUsers, 'add');
      setFavoriteUsers(users);
      setSummary(summary);
    } catch (error) {
      console.error('Failed to add favorite user:', error);
    }
  };

  const removeFavorite = async (user: User): Promise<void> => {
    try {
      const { summary, users } = await userAPI.setFavoriteUsers(user, favoriteUsers, 'remove');
      setFavoriteUsers(users);
      setSummary(summary);
    } catch (error) {
      console.error('Failed to remove favorite user:', error);
    }
  };

  const isFavorite = (userId: number): boolean => {
    return userId in favoriteUsers;
  };

  const value: FavoriteUsersContextValue = {
    favoriteUsers,
    addFavorite,
    removeFavorite,
    isFavorite,
    summary
  };

  return (
    <FavoriteUsersContext.Provider value={value}>
      {children}
    </FavoriteUsersContext.Provider>
  );
}

export function useFavoriteUsers(): FavoriteUsersContextValue {
  const context = useContext(FavoriteUsersContext);
  if (!context) {
    throw new Error('useFavoriteUsers must be used within a FavoriteUsersProvider');
  }
  return context;
}
