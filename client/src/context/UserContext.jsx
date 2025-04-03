// Manages global user profile state and statistics, providing functions to fetch and update user data.
import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userProfile, setUserProfile] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Axios instance with default configuration
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
    }
  });

  // Response interceptor for consistent error handling
  api.interceptors.response.use(
    response => response,
    error => {
      const message = error.response?.data?.message || error.message;
      setError(message);
      return Promise.reject(message);
    }
  );

  const fetchUserProfile = async (forceRefresh = false) => {
    if (!forceRefresh && userProfile) return { user: userProfile, stats: userStats };

    setLoading(true);
    try {
      const { data } = await api.get('/api/user/profile');
      setUserProfile(data.user);
      setUserStats(data.stats);
      setError(null);
      return data;
    } catch (err) {
      throw new Error(err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const validateAvatarUrl = (url) => {
    try {
      const validProtocols = ['http:', 'https:', 'data:'];
      const parsedUrl = new URL(url);
      return validProtocols.includes(parsedUrl.protocol);
    } catch {
      return false;
    }
  };

  const updateProfileData = async (updateData) => {
    setLoading(true);
    try {
      if (updateData.avatar && !validateAvatarUrl(updateData.avatar)) {
        throw new Error('Invalid avatar URL format');
      }

      const { data } = await api.put('/api/user/profile', updateData);
      setUserProfile(prev => ({ ...prev, ...data.user }));
      if (data.stats) setUserStats(data.stats);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const updateAvatar = async (avatarUrl) => {
    return updateProfileData({ avatar: avatarUrl });
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
      clearUserData();
    } catch (err) {
      throw new Error(err.message || 'Logout failed');
    }
  };

  const deleteAccount = async () => {
    setLoading(true);
    try {
      await api.delete('/api/user/profile');
      clearUserData();
      return true;
    } catch (err) {
      throw new Error(err.message || 'Account deletion failed');
    } finally {
      setLoading(false);
    }
  };

  const clearUserData = () => {
    setUserProfile(null);
    setUserStats(null);
    ['user', 'token', 'gameState', 'gameProgress', 'lastGameSession'].forEach(
      key => localStorage.removeItem(key)
    );
  };

  const value = {
    userProfile,
    userStats,
    loading,
    error,
    fetchUserProfile,
    updateProfile: updateProfileData,
    updateAvatar,
    deleteAccount,
    logout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);