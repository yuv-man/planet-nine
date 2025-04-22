import { createContext, useContext, useState } from 'react';
import { userAPI } from './api';

const FavoriteUsersContext = createContext();

export function FavoriteUsersProvider({ children }) {
  const [favoriteUsers, setFavoriteUsers] = useState({});
  const [summary, setSummary] = useState({});

  const addFavorite = async (user) => {
    try {
      const { summary, users } = await userAPI.setFavoriteUsers(user, favoriteUsers);
      setFavoriteUsers(users);
      setSummary(summary);
    } catch (error) {
      console.error('Failed to add favorite:', error);
    }
  };

  const removeFavorite = async (user) => {
    try {
      const { summary, users } = await userAPI.setFavoriteUsers(user, favoriteUsers);
      setFavoriteUsers(users);
      setSummary(summary);
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  const isFavorite = (userId) => {
    return Boolean(favoriteUsers[userId]);
  };

  const value = {
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

export function useFavoriteUsers() {
  const context = useContext(FavoriteUsersContext);
  if (context === undefined) {
    throw new Error('useFavoriteUsers must be used within a FavoriteUsersProvider');
  }
  return context;
}
