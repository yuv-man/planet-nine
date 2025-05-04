import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserList from './UserList';
import { FavoriteUsersProvider } from '../utils/context';

const mockUsers = [
  { 
    id: 1, 
    name: 'John Doe',
    email: 'john@example.com',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      zipcode: '12345'
    }
  },
  { 
    id: 2, 
    name: 'Jane Smith',
    email: 'jane@example.com', 
    address: {
      street: '456 Oak Rd',
      city: 'Somewhere',
      zipcode: '67890'
    }
  }
];

// Mock the API
jest.mock('../utils/api', () => ({
  userAPI: {
    getAllUsers: () => Promise.resolve(mockUsers),
    getAvatar: () => Promise.resolve('avatar-url.jpg'),
  },
}));

describe('UserList', () => {
  test('displays loading state and then users', async () => {
    render(
      <FavoriteUsersProvider>
        <UserList />
      </FavoriteUsersProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(await screen.findByText('Jane Smith')).toBeInTheDocument();
  });

  test('filters users based on search input', async () => {
    render(
      <FavoriteUsersProvider>
        <UserList />
      </FavoriteUsersProvider>
    );

    await screen.findByText('John Doe');
    
    const searchInput = screen.getByPlaceholderText('Search users by name...');
    fireEvent.change(searchInput, { target: { value: 'jane' } });

    expect(await screen.findByText('Jane Smith')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });
});
