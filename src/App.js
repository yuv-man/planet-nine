import React, { useState, useEffect } from 'react';

import './App.css';
import UserCard from './components/UserCard';
import { userAPI } from './utils/api';

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    userAPI.getUsers().then(setUsers);
  }, []);

  return (
    <div className="App">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

export default App;
