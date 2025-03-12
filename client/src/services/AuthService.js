// services/AuthService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const signupUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
    return response.data;
  } catch (error) {
    console.error('Error during signup:', error);
    return { message: error.response?.data?.message || 'Signup failed' };
  }
};

export const signIn = async (email, password) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/signin`, { email, password });
    localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || 'Login failed';
  }
};
