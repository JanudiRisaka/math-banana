  //pages/SignUp.jsx
  import React, { useState } from 'react';
  import { motion } from 'framer-motion';
  import { Sparkles, ArrowLeft, Mail, Lock, User, Loader2 } from 'lucide-react';
  import { Link, useNavigate } from 'react-router-dom';
  import { Button } from '../components/Layout/Button';
  import { useAuth } from '../context/AuthContext';
  import PasswordStrengthMeter from '../components/Auth/PasswordStrengthMeter';
  import { z } from 'zod';

  const signUpSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm Password must be at least 8 characters')
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  export default function SignUp() {
    const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { signup } = useAuth(); // Now works correctly
    const navigate = useNavigate();

    const handleLogoClick = () => {
      navigate('/');
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

// Updated handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const credentials = {
      username: formData.username.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password.trim(),
      confirmPassword: formData.confirmPassword.trim()
    };

    signUpSchema.parse(credentials);

    if (!acceptedTerms) {
      throw new Error('You must accept the privacy policy');
    }
    console.log('Attempting signup with:', credentials);
    // Execute signup and wait for response
    const response = await signup(credentials);
    if (!response.success) {
      throw new Error(response.message || 'Signup failed');
    }
    console.log('Signup response:', response);
    console.log('Navigating to verify-email with state:', {
      email: formData.email,
      fromSignUp: true
    });
    // Navigate immediately after successful signup
    navigate('/verify-email', {
      state: { email: formData.email, fromSignUp: true }
    });

  } catch (err) {
    console.error('Signup error caught:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

    // JSX remains the same as original
    return (
      <div className="min-h-auto flex flex-col items-center justify-center bg-cover bg-center">
      <div className="absolute inset-0 bg-gradient-to-b from-[#001B3D]/90 to-[#000B1A]/90 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <Button
        variant="ghost"
        className="absolute left-4 top-4 text-white hover:text-yellow-400 z-20"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </Button>
        <div className="p-8 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
          <div className="flex items-center justify-center mb-8">
            <button
              onClick={handleLogoClick}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity mt-8"
            >
              <Sparkles className="w-8 h-8 text-yellow-400" />
              <h1 className="text-3xl font-bold text-white font-serif">Math Banana</h1>
            </button>
          </div>

          <h2 className="text-2xl font-bold text-center text-white mb-2">Create Account</h2>
          <p className="text-center text-gray-300 mb-8">
            Join the magical math adventure
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center"
            >
{error.startsWith('Cannot connect') ? (
      <>
        {error} <br />
        <span className="text-sm">Please check your backend server</span>
      </>
    ) : (
      error
    )}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50"
                  placeholder="Choose a username"
                  required
                  minLength={3}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

{/* Password Field */}
<div>
  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
    Password
  </label>
  <div className="relative">
    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    <input
      type="password"
      id="password"
      name="password"
      autoComplete="new-password"
      value={formData.password}
      onChange={handleChange}
      className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50"
      placeholder="Create a password"
      required
      minLength={8}
    />
  </div>
  <PasswordStrengthMeter password={formData.password} />
</div>

{/* Confirm Password Field */}
<div>
  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
    Confirm Password
  </label>
  <div className="relative">
    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    <input
      type="password"
      id="confirmPassword"
      name="confirmPassword"
      autoComplete="new-password"
      value={formData.confirmPassword}
      onChange={handleChange}
      className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50"
      placeholder="Confirm your password"
      required
    />
  </div>
</div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="privacy"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-yellow-400 focus:ring-yellow-400"
              />
              <label htmlFor="privacy" className="ml-2 text-sm text-gray-300">
                I agree to the{' '}
                <Link to="/privacy" className="text-yellow-400 hover:text-yellow-300">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              variant="fantasy"
              className="w-full py-2 flex items-center justify-center"
              disabled={loading || !acceptedTerms}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <Link
              to="/signin"
              className="text-yellow-400 hover:text-yellow-300 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
    );
  }