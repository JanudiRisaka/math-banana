// src/contexts/AuthProvider.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Decode the token and check expiration
        const decoded = jwt_decode(token);
        const currentTime = Date.now() / 1000; // current time in seconds

        if (decoded.exp < currentTime) {
          localStorage.removeItem('token');
          setUser(null);
          setLoading(false);
          return;
        }

        // Otherwise, try to get user data using the /me route
        const res = await axios.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(res.data.user);
      } catch (error) {
        console.error('Authentication failed:', error.message);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Sign Up
  const signUp = async (email, password, username) => {
    try {
      const res = await axios.post('http://localhost:5000/auth/signup', {
        email,
        password,
        username
      });

      if (res.status !== 200) {
        throw new Error(res.data.message || 'Signup failed');
      }

      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      navigate('/game');
    } catch (error) {
      console.error('Signup failed:', error.response?.data?.message || error.message);
      throw error.message;
    }
  };

  // Sign In
  const signIn = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/auth/signin', {
        email,
        password
      });

      if (res.status !== 200) {
        throw new Error(res.data.message || 'Login failed');
      }

      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      navigate('/game');
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      throw error.response?.data?.message || 'Login failed';
    }
  };

  // Sign Out
  const signOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/signin');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        signUp,
        signIn,
        signOut,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
