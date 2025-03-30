// AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verify authentication status on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/is-auth`, {
          credentials: 'include'
        });

        if (response.ok) {
          const userResponse = await fetch(`${API_BASE_URL}/api/user/data`, {
            credentials: 'include'
          });
          const userData = await userResponse.json();
          setUser(userData.userData);
        }
      } catch (error) {
        console.error('Auth check error:', error);
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
        const response = await fetch(`${API_BASE_URL}/api/auth/is-auth`, {
          method: 'GET',
          credentials: 'include'
        });

        if (!response.ok) {
          setUser(null);
          return { isAuthenticated: false };
        }

        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
          return { isAuthenticated: true, user: data.user };
        }

        setUser(null);
        return { isAuthenticated: false };
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
        return { isAuthenticated: false };
      } finally {
        setIsLoading(false);
      }
    },

    signup: async (credentials) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
          credentials: 'include'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Signup failed');
        }

        return await response.json();
      } catch (err) {
        // Handle network errors specifically
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

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Authentication failed');
        }

        // Get user data after successful authentication
        const userResponse = await fetch(`${API_BASE_URL}/api/user/data`, {
          credentials: 'include'
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await userResponse.json();
        setUser(userData.userData);

        return { success: true, user: userData.userData };

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
    }
  };

  useEffect(() => {
    authActions.checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider
    value={{
      user,
      isAuthenticated: !user,
      isLoading,
      error,
      ...authActions
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);