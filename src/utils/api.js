import axios from 'axios';

export const userAPI = {
    getUsers: async () => {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        return response.data;
    },

    getAvatar: async (id) => {
        const avatarUrl = `https://i.pravatar.cc/150?u=${id}`;
        return avatarUrl;
    },

    getFavoriteById: async (id, user, favoriteUsers) => {
        const maxRetries = 2;
        let attempts = 0;
    
        const makeRequest = async () => {
            const delay = Math.floor(Math.random() * (1500 - 300 + 1) + 300);
            await new Promise(resolve => setTimeout(resolve, delay));
    
            if (Math.random() < 0.4) {
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
    },
    
    setFavoriteUsers: async (user, favoriteUsers) => {
        const updatedFavorites = { ...favoriteUsers };
        
        if (updatedFavorites[user.id]) {
            delete updatedFavorites[user.id];
        } else {
            updatedFavorites[user.id] = {
                ...user,
                isFavorite: true
            };
        }
        
        const favoriteUserIds = Object.keys(updatedFavorites);
        
        if (favoriteUserIds.length === 0) {
            return {
                summary: {
                    totalFavorites: 0,
                    successCount: 0,
                    failedCount: 0,
                    failedUsers: []
                },
                users: {}
            };
        }
        
        const results = await Promise.allSettled(
            favoriteUserIds.map(id => {
                const favoriteUser = updatedFavorites[id];
                console.log('Processing favoriteUser:', favoriteUser);
                return userAPI.getFavoriteById(id, favoriteUser, updatedFavorites);
            })
        );
        
        const summary = {
            totalFavorites: favoriteUserIds.length,
            successCount: 0,
            failedCount: 0,
            failedUsers: []
        };
    
        const finalUsers = {};
    
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
        return {
            summary,
            users: finalUsers
        };
    }
}



