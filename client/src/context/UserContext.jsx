import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userProfile, setUserProfile] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create API instance with appropriate headers
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true, // Enable cookies
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add auth token to requests if available
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/user/profile');
      setUserProfile(response.data.user);
      setUserStats(response.data.stats);
      setError(null);
      return {
        user: response.data.user,
        stats: response.data.stats
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Validate avatar URL before sending to backend
  const validateAvatarUrl = (url) => {
    // Check if it's a valid URL format
    try {
      new URL(url);
      // Check if it's a DiceBear URL or other allowed format
      return (
        url.includes('api.dicebear.com') ||
        url.startsWith('data:image/svg+xml') ||
        url.startsWith('https://') ||
        url.startsWith('http://')
      );
    } catch (err) {
      return false;
    }
  };

  // Update avatar specifically
  const updateAvatar = async (avatarUrl) => {
    setLoading(true);
    try {
      // Validate URL format first
      if (!validateAvatarUrl(avatarUrl)) {
        throw new Error('Invalid avatar URL format');
      }

      const response = await api.put('/api/user/profile/avatar', { avatar: avatarUrl });
      setUserProfile(prev => ({ ...prev, avatar: response.data.user.avatar }));
      setError(null);
      return response.data.user;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Avatar update failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // General profile update
  const updateProfile = async (updateData) => {
    setLoading(true);
    try {
      // Special handling for avatar updates
      if (updateData.avatar) {
        if (!validateAvatarUrl(updateData.avatar)) {
          throw new Error('Invalid avatar URL format');
        }
      }

      const response = await api.put('/api/user/profile', updateData);
      setUserProfile(prev => ({ ...prev, ...response.data.user }));

      // Also update stats if they're returned in the response
      if (response.data.stats) {
        setUserStats(response.data.stats);
      }

      setError(null);
      return response.data.user;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Update failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
      setUserProfile(null);
      setUserStats(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Logout failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteAccount = async () => {
    setLoading(true);
    try {
      const response = await api.delete('/api/user/profile');

      // Clear all user data from state and local storage
      setUserProfile(null);
      setUserStats(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      // Clear any game-related data from local storage if present
      localStorage.removeItem('gameState');
      localStorage.removeItem('gameProgress');
      localStorage.removeItem('lastGameSession');

      setError(null);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Account deletion failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    userProfile,
    userStats,
    loading,
    error,
    fetchUserProfile,
    updateProfile,
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