import React from 'react';
import UserList from './components/UserList';
import './App.css';
import { FavoriteUsersProvider } from './utils/context';

function App() {
  return (
    <div className="App">
      <FavoriteUsersProvider>
        <UserList />
      </FavoriteUsersProvider>
    </div>
  );
}

export default App; 