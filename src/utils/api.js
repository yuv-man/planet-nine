import axios from 'axios';

export const userAPI = {
    getUsers: async () => {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        return response.data;
    },

    getAvatar: async (id) => {
        const avatarUrl = `https://i.pravatar.cc/150?u=${id}`;
        return avatarUrl;
    }
}



