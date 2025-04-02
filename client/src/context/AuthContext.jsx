import { createContext, useContext, useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // On initial load, try to rehydrate the user from localStorage
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleResponse = async (response, endpoint) => {
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Invalid response from ${endpoint}: ${text.slice(0, 100)}`);
    }
    return response.json();
  };

  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
  };

  const checkServerHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      if (!response.ok) throw new Error('Server health check failed');
    } catch (error) {
      throw new Error(`Cannot connect to server: ${error.message}`);
    }
  };

  const fetchUserData = async () => {
    try {
      const userResponse = await fetch(`${API_BASE_URL}/api/user/data`, {
        credentials: 'include'
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await handleResponse(userResponse, '/api/user/data');

      if (userData && userData.userData) {
        // Ensure we preserve any previously loaded avatar/username if not in the response
        const newUserData = {
          ...userData.userData
        };

        // Update user state and localStorage
        setUser(prevUser => {
          // If we already have a user with avatar/username, preserve those fields
          // if they're not in the new data
          if (prevUser) {
            if (!newUserData.avatar && prevUser.avatar) {
              newUserData.avatar = prevUser.avatar;
            }
            if (!newUserData.username && prevUser.username) {
              newUserData.username = prevUser.username;
            }
          }

          localStorage.setItem('user', JSON.stringify(newUserData));
          return newUserData;
        });

        return newUserData;
      }

      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  // Verify authentication status on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await checkServerHealth();
        const response = await fetch(`${API_BASE_URL}/api/auth/is-auth`, {
          credentials: 'include'
        });

        if (response.ok) {
          await fetchUserData();
        } else {
          // Clear user data if not authenticated
          setUser(null);
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const authActions = {
    checkAuthStatus: async () => {
      setIsLoading(true);
      try {
        await checkServerHealth();
        const response = await fetch(`${API_BASE_URL}/api/auth/is-auth`, {
          method: 'GET',
          credentials: 'include'
        });

        if (!response.ok) {
          setUser(null);
          localStorage.removeItem('user');
          return { isAuthenticated: false };
        }

        const data = await handleResponse(response, '/api/auth/is-auth');

        if (data.success) {
          // Only fetch user data if we don't have it already
          if (!user) {
            const userData = await fetchUserData();
            return { isAuthenticated: true, user: userData };
          }

          return { isAuthenticated: true, user };
        }

        setUser(null);
        localStorage.removeItem('user');
        return { isAuthenticated: false };
      } catch (error) {
        console.error('Auth check error:', error);
        setError(error.message);
        return { isAuthenticated: false };
      } finally {
        setIsLoading(false);
      }
    },

    signup: async (credentials) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
          credentials: 'include'
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Signup failed');
        }
        return await response.json();
      } catch (err) {
        const errorMessage = err.message.includes('Failed to fetch')
          ? 'Cannot connect to server. Check your network connection.'
          : err.message;
        throw new Error(errorMessage);
      }
    },

    signin: async (email, password) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: 'include'
        });

        const data = await handleResponse(response, '/api/auth/signin');

        if (!response.ok) {
          throw new Error(data.message || 'Authentication failed');
        }

        // Get user data after successful authentication
        const userData = await fetchUserData();

        return { success: true, user: userData };
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },

    logout: async () => {
      try {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          credentials: 'include'
        });
        setUser(null);
        localStorage.removeItem('user');
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },

    sendVerificationOtp: async (email) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/send-verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
          credentials: 'include'
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;

      } catch (err) {
        setError(err.message);
        throw err;
      }
    },

    verifyEmail: async (email, otp) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp }),
          credentials: 'include'
        });
        const data = await response.json();
        console.log('Verify-email API response:', data);

        if (!response.ok) {
          throw new Error(data.message || 'Verification failed');
        }

        return data;

      } catch (err) {
        setError(err.message);
        throw err;
      }
    },

    sendResetOtp: async (email) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/send-reset-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },

    resetPassword: async (email, otp, newPassword) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp, newPassword })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },

    refreshUserData: async () => {
      return await fetchUserData();
    }
  };

  useEffect(() => {
    authActions.checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        updateUser,
        isAuthenticated: !!user,
        isLoading,
        error,
        ...authActions
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);