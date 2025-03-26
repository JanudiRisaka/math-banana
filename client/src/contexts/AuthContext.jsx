//client/src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return setLoading(false);

        const res = await axios.get('http://localhost:5000/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user)); // Store user in localStorage
      } catch (error) {
        console.error('Token validation failed:', error.response?.data); // Log error details
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser)); // Restore user from localStorage

    checkAuth();
  }, []);


  // Sign Up
  const signUp = async (email, password, username) => {
    try {
      const res = await axios.post('http://localhost:5000/auth/signup', {
        email,
        password,
        username,
      });
      if (res.data && res.data.token) {
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      navigate('/game');
    }
    } catch (error) {
      throw error.response?.data?.message || 'Signup failed';
    }
  };

  // Sign In
  const signIn = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/auth/signin', {email,password});
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        navigate('/');
      }
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  // Sign Out (Logout)
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/'); // Redirect to Sign In page
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        signUp,
        signIn,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
