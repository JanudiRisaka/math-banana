import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Mail, Lock, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Layout/Button';
import { OtpInput } from '../components/OtpInput';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const emailSchema = z.string().email('Invalid email address');
const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');
const otpSchema = z.string().length(6, 'OTP must be 6 digits');

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { sendResetOtp, resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [isLoading, setIsLoading] = useState(false);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate email
      emailSchema.parse(email);

      const response = await sendResetOtp(email);

      if (response?.success) {
        toast.success('OTP sent to your email');
        setStep(2);
      } else {
        setError(response?.message || 'Failed to send OTP');
        toast.error(response?.message || 'Failed to send OTP');
      }
    } catch (err) {
      let errorMessage = err.message;
      if (err instanceof z.ZodError) {
        errorMessage = err.errors[0].message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate OTP and password
      otpSchema.parse(otp);
      passwordSchema.parse(newPassword);

      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const response = await resetPassword(email, otp, newPassword);

      if (response?.success) {
        toast.success('Password reset successfully');
        navigate('/signin');
      } else {
        setError(response?.message || 'Failed to reset password');
        toast.error(response?.message || 'Failed to reset password');
      }
    } catch (err) {
      let errorMessage = err.message;
      if (err instanceof z.ZodError) {
        errorMessage = err.errors[0].message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
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

          <h2 className="text-2xl font-bold text-center text-white mb-2">Reset Password</h2>
          <p className="text-center text-gray-300 mb-8">
            {step === 1 && "Enter your email to receive a reset code"}
            {step === 2 && "Enter the 6-digit code sent to your email"}
            {step === 3 && "Enter your new password"}
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

          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
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

              <Button
                type="submit"
                variant="fantasy"
                className="w-full py-2 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Send Reset Code'
                )}
              </Button>
            </form>
          )}

          {step === 2 && (
            <form className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300 text-center mb-2">
                  Enter the 6-digit code sent to {email}
                </label>

                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  error=""
                />

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-yellow-400 hover:text-yellow-300 text-sm"
                    disabled={isLoading}
                  >
                    Resend code
                  </button>
                </div>
              </div>

              <Button
                type="button"
                variant="fantasy"
                className="w-full py-2 flex items-center justify-center"
                disabled={isLoading || otp.length !== 6}
                onClick={() => setStep(3)}
              >
                Verify Code
              </Button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50"
                    placeholder="Enter new password"
                    required
                  />
                </div>
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="fantasy"
                className="w-full py-2 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}