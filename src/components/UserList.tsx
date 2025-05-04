import React, { useState, useEffect, useMemo } from 'react';
import UserCard from './UserCard';
import '../styles/UserList.scss';
import { userAPI } from '../utils/api';
import { useFavoriteUsers } from '../utils/context';
import type { User } from '../types/types';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { summary } = useFavoriteUsers();

  const fetchUsers = useMemo(
    () => userAPI.getAllUsers(), []);

  useEffect(() => {
    fetchUsers
      .then(data => {
        setUsers(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => 
    users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [users, searchTerm]
  );

  if (isLoading) {
    return <div className="user-list">Loading...</div>;
  }

  if (error) {
    return <div className="user-list error">{error}</div>;
  }

  return (
    <div className="user-list-container">

        <input
          type="text"
          placeholder="Search users by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="user-list">
        {filteredUsers.length === 0 ? (
            <p>No users found</p>
        ) : (
            filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} />
            ))
        )}
        </div>
        {summary && (
          <div className="summary">
            <p>Total Favorites: {summary.totalFavorites}</p>
            <p>Success: {summary.successCount}</p>
            <p>Failed: {summary.failedCount}</p>
            <p>Failed Users: {summary?.failedUsers?.length > 0 ? summary.failedUsers.map((failedUser: User) => failedUser.name).join(', ') : 'None'}</p>
          </div>
        )}
    </div>
  );
};

export default UserList;
