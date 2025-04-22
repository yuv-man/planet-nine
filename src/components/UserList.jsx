import React, { useState, useEffect, useMemo } from 'react';
import UserCard from './UserCard';
import '../styles/UserList.scss';
import { userAPI } from '../utils/api';
import { useFavoriteUsers } from '../utils/context';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { summary } = useFavoriteUsers();

  const fetchUsers = useMemo(
    () => userAPI.getUsers(), []);

  useEffect(() => {
    fetchUsers
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => 
    users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [users, searchTerm]
  );

  if (loading) {
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
            <p>Failed Users: {summary?.failedUsers?.length > 0 ? summary.failedUsers.map(failedUser => failedUser.name).join(', ') : 'None'}</p>
          </div>
        )}
    </div>
  );
};

export default UserList;
