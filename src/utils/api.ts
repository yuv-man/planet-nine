import axios, { AxiosResponse } from 'axios';
import { User, FavoriteUsers, FavoriteUsersResponse, Summary } from '../types/types';

const API_URL = 'https://jsonplaceholder.typicode.com';
const AVATAR_URL = 'https://i.pravatar.cc';

interface APIConfig {
    MAX_RETRIES: number;
    MIN_DELAY: number;
    MAX_DELAY: number;
    FAILURE_RATE: number;
}

const API_CONFIG: APIConfig = {
    MAX_RETRIES: 2,
    MIN_DELAY: 300,
    MAX_DELAY: 1500,
    FAILURE_RATE: 0.4
};

const getRandomDelay = (): number => {
    return Math.floor(Math.random() * (API_CONFIG.MAX_DELAY - API_CONFIG.MIN_DELAY + 1) + API_CONFIG.MIN_DELAY);
};

const userClient = axios.create({
    baseURL: API_URL,
    timeout: 10000,
  });

export const userAPI = {
    getAllUsers: async (): Promise<User[]> => {
        try {
            const response: AxiosResponse<User[]> = await userClient.get<User[]>('/users');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch all users:', error);
            throw error;
        }
    },

    getUserById: async (id: number): Promise<User> => {
        try {
            const response: AxiosResponse<User> = await userClient.get<User>(`/users/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch user with id ${id}:`, error);
            throw error;
        }
    },

    getAvatar: async (id: number): Promise<string> => {
        try {
            return `${AVATAR_URL}/150?u=${id}`;
        } catch (error) {
            console.error(`Failed to get avatar for user ${id}:`, error);
            throw error;
        }
    },

    getFavoriteById: async (id: string, user: User, favoriteUsers: FavoriteUsers): Promise<User> => {
        const maxRetries = API_CONFIG.MAX_RETRIES;
        let attempts = 0;
    
        const makeRequest = async (): Promise<User> => {
            const delay = getRandomDelay();
            await new Promise(resolve => setTimeout(resolve, delay));
    
            if (Math.random() < API_CONFIG.FAILURE_RATE) {
                throw new Error('Random API failure');
            }
    
            return {
                ...user,
                isFavorite: Boolean(favoriteUsers[id])
            };
        };
    
        while (attempts <= maxRetries) {
            try {
                return await makeRequest();
            } catch (error) {
                attempts++;
                if (attempts > maxRetries) {
                    throw error;
                }
                console.log(`Attempt ${attempts} failed, retrying...`);
            }
        }
        
        throw new Error('Max retries exceeded');
    },
    
    setFavoriteUsers: async (user: User, favoriteUsers: FavoriteUsers, action: 'add' | 'remove'): Promise<FavoriteUsersResponse> => {
        // Input validation
        if (!user || !user.id) {
            throw new Error('Invalid user data');
        }

        const updatedFavorites = updateFavoritesList(user, favoriteUsers, action);
        return processFavoriteUsers(updatedFavorites);
    }
};

const updateFavoritesList = (user: User, favoriteUsers: FavoriteUsers, action: 'add' | 'remove'): FavoriteUsers => {
    const updatedFavorites: FavoriteUsers = { ...favoriteUsers };
    
    if (action === 'add' && updatedFavorites[user.id]) {
        delete updatedFavorites[user.id];
    } else if (action === 'remove' && !updatedFavorites[user.id]) {
        updatedFavorites[user.id] = {
            ...user,
            isFavorite: true
        };
    }
    
    return updatedFavorites;
};

const processFavoriteUsers = async (updatedFavorites: FavoriteUsers): Promise<FavoriteUsersResponse> => {
    const favoriteUserIds = Object.keys(updatedFavorites);
    
    if (favoriteUserIds.length === 0) {
        return createEmptyResponse();
    }
    
    try {
        const results = await Promise.allSettled(
            favoriteUserIds.map(async (id) => {
                const favoriteUser = updatedFavorites[id];
                return userAPI.getFavoriteById(id, favoriteUser, updatedFavorites);
            })
        );
        
        return createResponseFromResults(results, favoriteUserIds, updatedFavorites);
    } catch (error) {
        console.error('Failed to process favorite users:', error);
        throw error;
    }
};

const createEmptyResponse = (): FavoriteUsersResponse => ({
    summary: {
        totalFavorites: 0,
        successCount: 0,
        failedCount: 0,
        failedUsers: []
    },
    users: {}
});

const createResponseFromResults = (
    results: PromiseSettledResult<User>[],
    favoriteUserIds: string[],
    updatedFavorites: FavoriteUsers
): FavoriteUsersResponse => {
    const summary: Summary = {
        totalFavorites: favoriteUserIds.length,
        successCount: 0,
        failedCount: 0,
        failedUsers: []
    };

    const finalUsers: FavoriteUsers = {};

    results.forEach((result, index) => {
        const id = favoriteUserIds[index];
        if (result.status === 'fulfilled') {
            summary.successCount++;
            finalUsers[id] = result.value;
        } else {
            summary.failedCount++;
            summary.failedUsers.push({
                id: id,
                name: updatedFavorites[id].name,
                error: result.reason.message
            });
            finalUsers[id] = updatedFavorites[id];
        }
    });

    console.log(summary);
    return { summary, users: finalUsers };
}; 