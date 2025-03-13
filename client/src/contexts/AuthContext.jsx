import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Updated import

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null); // For handling errors
  const navigate = useNavigate();

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return setLoading(false);

        // Decode the token using jwtDecode
        const decodedToken = jwtDecode(token); // Updated usage
        console.log("Decoded token:", decodedToken);

        // Check if the token is expired
        const currentTime = Math.floor(Date.now() / 1000); // Current timestamp in seconds
        if (decodedToken.exp < currentTime) {
          console.log("Token expired, please log in again.");
          localStorage.removeItem('token'); // Remove expired token
          navigate('/login'); // Redirect to login page
          return;
        }

        // If the token is valid, fetch user data
        const res = await axios.get('http://localhost:5000/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(res.data.user);
      } catch (error) {
        localStorage.removeItem('token');
        console.error("Authentication error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Function to fetch user data
  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log("User data:", response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Sign Up
  const signUp = async (email, password, username) => {
    try {
      const res = await axios.post('http://localhost:5000/auth/signup', {
        email,
        password,
        username,
      });

      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      navigate('/game');
    } catch (error) {
      setAuthError(error.response?.data?.message || 'Signup failed');
      throw error;
    }
  };

  // Sign In
  const signIn = async (email, password, rememberMe) => {
    try {
      const response = await fetch('http://localhost:5000/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      if (!response.ok) {
        throw new Error('Failed to sign in');
      }

      const data = await response.json();
      return data; // Ensure this includes the token
    } catch (error) {
      throw new Error(error.message || 'Failed to sign in');
    }
  };

  // Sign Out (Logout)
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setAuthError(null); // Clear any authentication errors on logout
    navigate('/'); // Redirect to Sign In page
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        signUp,
        signIn,
        fetchUserData,
        logout,
        loading,
        authError, // Pass the error state
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);