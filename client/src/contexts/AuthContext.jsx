//src/contexts/Authcontext.jsx
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

        const res = await axios.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(res.data.user);
      } catch (error) {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Sign Up
  const signUp = async (email, password, username) => {
    try {
      const res = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      localStorage.setItem('token', data.token);
      setUser(data.user);
      navigate('/game');
    } catch (error) {
      throw error.message;
    }
  };


  // Sign In
  const signIn = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/auth/signin', { // Updated URL
        email,
        password
      });

      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      navigate('/game');
    } catch (error) {
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