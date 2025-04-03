/* Defines the page for handling the password reset process,
including OTP verification and setting a new password.*/
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from "lucide-react";
import { Sparkles, ArrowLeft, Mail, Loader2, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Layout/Button';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { OtpInput } from '../components/Auth/OtpInput';
import PasswordStrengthMeter from '../components/Auth/PasswordStrengthMeter';

const emailSchema = z.string().email('Please enter a valid email address');

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const { sendResetOtp, resetPassword } = useAuth();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleSendVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      emailSchema.parse(email);
      const response = await sendResetOtp(email);

      if (response.success) {
        toast.success('Verification code sent to your email');
        setOtpSent(true);
      } else {
        setError(response.message || 'Failed to send verification code');
        toast.error(response.message || 'Failed to send verification code');
      }
    } catch (err) {
      // ... error handling ...
    } finally {
      setIsLoading(false);
    }
  };

  // Rename the reset handler for clarity
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await resetPassword(email, otp, newPassword);
      if (response.success) {
        toast.success('Password reset successfully!');
        navigate('/signin');
      } else {
        setError(response.message || 'Password reset failed');
        toast.error(response.message || 'Password reset failed');
      }
    } catch (err) {
      // ... error handling ...
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-auto flex flex-col items-center justify-center bg-cover bg-center">
      <div className="absolute inset-0 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <Button
          variant="ghost"
          className="absolute left-4 top-4 text-white hover:text-yellow-400 z-20"
          onClick={() => navigate('/signin')}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Sign In
        </Button>

        <div className="p-8 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
          <div className="flex items-center justify-center my-8">
            <button
              onClick={handleLogoClick}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <Sparkles className="w-8 h-8 text-yellow-400" />
              <h1 className="text-3xl font-bold text-white font-serif">Math Banana</h1>
            </button>
          </div>

          <h2 className="text-2xl font-bold text-center text-white mb-2">
          {otpSent ? 'Reset Password' : 'Forgot Password'}
        </h2>
        <p className="text-center text-gray-300 mb-8">
          {otpSent
            ? 'Enter the verification code and new password'
            : 'Enter your email and we\'ll send you a verification code'}
        </p>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center"
            >
              {error}
            </motion.div>
          )}

<form onSubmit={otpSent ? handlePasswordReset : handleSendVerification} className="space-y-6">
          {!otpSent ? (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50"
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />
              </div>
            </div>
          ) : (
            <>
              <OtpInput
                value={otp}
                onChange={(value) => setOtp(value)}
                error={error}
              />

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    id="newPassword"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50"
                    placeholder="Enter new password"
                    required
                  />
                </div>
                {newPassword && <PasswordStrengthMeter password={newPassword} />}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    id="confirmPassword"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                {confirmPassword && (
                  <div className="mt-2 text-sm">
                    {confirmPassword === newPassword ? (
                      <div className="flex items-center text-green-500">
                        <Check className="w-4 h-4 mr-2" />
                        Passwords match
                      </div>
                    ) : (
                      <div className="flex items-center text-red-500">
                        <X className="w-4 h-4 mr-2" />
                        Passwords do not match
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          <Button
            type="submit"
            variant="fantasy"
            className="w-full py-2 flex items-center justify-center"
            disabled={isLoading || (!otpSent && !email) || (otpSent && (!otp || newPassword !== confirmPassword))}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : otpSent ? (
              'Reset Password'
            ) : (
              'Send Verification Code'
            )}
          </Button>
        </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Remember your password?{' '}
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