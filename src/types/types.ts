export interface User {
    id: number;
    name: string;
    isFavorite?: boolean;
    [key: string]: any; // For other potential user properties
}

export interface FavoriteUsers {
    [key: string]: User;
}

export interface FailedUser {
    id: string;
    name: string;
    error: string;
}

export interface Summary {
    totalFavorites: number;
    successCount: number;
    failedCount: number;
    failedUsers: FailedUser[];
}

export interface FavoriteUsersResponse {
    summary: Summary;
    users: FavoriteUsers;
}

export interface fetchRequest {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: any;
    headers?: any;
    params?: any;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    status: number;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }