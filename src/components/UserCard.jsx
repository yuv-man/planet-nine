import React, { useState, useEffect } from 'react';
import '../styles/UserCard.scss';
import { userAPI } from '../utils/api';
const UserCard = ({ user }) => {

    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        userAPI.getAvatar(user.id).then(setAvatar);
    }, [user.id]);

    const addressFormatted = `${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`;

  return (
    <div className="user-card">
      <div className="avatar">
        <img src={avatar} alt={`${user.name}'s avatar`} />
      </div>
      <div className="info">
        <h2 className="name">{user.fullName}</h2>
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
