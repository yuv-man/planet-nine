import React, { useState, useEffect } from 'react';
import '../styles/UserCard.scss';
import { userAPI } from '../utils/api';
import { useFavoriteUsers } from '../utils/context';
import { toast } from 'react-hot-toast';

const UserCard = ({ user }) => {

    const [avatar, setAvatar] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const { 
        addFavorite, 
        removeFavorite, 
        isFavorite: isUserFavorite,
        summary 
    } = useFavoriteUsers();

    useEffect(() => {
        userAPI.getAvatar(user.id).then(setAvatar);
    }, [user.id]);


    useEffect(() => {
        setIsFavorite(isUserFavorite(user.id));
    }, [user.id, isUserFavorite]);

    useEffect(() => {
        if (summary?.failedUsers?.some(failedUser => failedUser.id === user.id)) {
            toast.error(`Failed to update favorite status for ${user.name}`);
        }
    }, [summary, user.id, user.name]);

    const addressFormatted = `${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`;

    const handleFavoriteClick = async () => {
        const newFavoriteState = !isFavorite;
        setIsFavorite(newFavoriteState); 

        try {
            if (isUserFavorite(user.id)) {
                await removeFavorite(user);
            } else {
                await addFavorite(user);
            }
        } catch (error) {
            setIsFavorite(!newFavoriteState);
            console.error('Failed to update favorite status:', error);
        }
    };

  return (
    <div className="user-card">
      <div className="avatar">
        <img src={avatar} alt={`${user.name}'s avatar`} />
      </div>
      <div className="info">
        <h2 className="name">{user.name}</h2>
        <button 
            className={`favorite-button ${isFavorite ? 'active' : ''}`}
            onClick={handleFavoriteClick}
        >
            {isFavorite ? '★ Remove from Favorites' : '☆ Add to Favorites'}
        </button>
        <p className="email">
          <a href={`mailto:${user.email}`}>{user.email}</a>
        </p>
        <p className="phone">{user.phone}</p>
        <p className="website">
          <a href={`https://${user.website}`} target="_blank" rel="noopener noreferrer">
            {user.website}
          </a>
        </p>
        <p className="address">{addressFormatted}</p>
        <p className="company">{user.companyName}</p>
        
      </div>
    </div>
  );
};

export default UserCard;
