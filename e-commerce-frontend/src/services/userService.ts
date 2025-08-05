import axios from 'axios';
import { User, UserPreferences } from '../types/user';
import { API_URL } from '../config';

const userService = {
  async fetchUsers(): Promise<User[]> {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  },

  async updateUser(userId: string, user: Partial<User>): Promise<User> {
    const response = await axios.put(`${API_URL}/users/${userId}`, user);
    return response.data;
  },

  async deleteUser(userId: string): Promise<void> {
    await axios.delete(`${API_URL}/users/${userId}`);
  },

  async updatePreferences(userId: string, preferences: UserPreferences): Promise<void> {
    await axios.patch(`${API_URL}/users/${userId}/preferences`, preferences);
  },

  async updateSecuritySettings(userId: string, settings: any): Promise<void> {
    await axios.patch(`${API_URL}/users/${userId}/security`, settings);
  },
};

export { userService };
