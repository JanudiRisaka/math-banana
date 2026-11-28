// Defines the page where users verify their email address using an OTP sent to them.
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { OtpInput } from '../components/Auth/OtpInput';
import toast from 'react-hot-toast';

const EmailVerify = () => {
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const { sendVerificationOtp, verifyEmail, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isCheckingState, setIsCheckingState] = useState(true);

  // Consolidated state validation
  useEffect(() => {
    const verifyState = () => {
      if (!location.state?.email || !location.state?.fromSignUp) {
        console.warn('Invalid access - redirecting to signup');
        return;
      }

      setEmail(location.state.email.trim().toLowerCase());
      setIsCheckingState(false);
    };

    verifyState();
  }, [location, navigate]);

  // OTP resend timer
  useEffect(() => {
    if (!timeLeft) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSendOtp = async () => {
    setIsSending(true);
    setSendError('');

    try {
      await sendVerificationOtp(email);
      setOtp('');
      setIsOtpSent(true);
      setTimeLeft(60);
    } catch (error) {
      setSendError(error.message || 'Failed to send OTP');
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const data = await verifyEmail(email, otp);

      if (data.success) {
        toast.success('Email verified successfully!');

        navigate('/');
        window.location.reload();
      } else {
        toast.error(data.message || 'Verification failed');
      }

    } catch (error) {
      console.error('Verification error:', error);
      toast.error(error.message || 'Verification failed');
    }
  };

  if (isCheckingState) {
    return <div className="text-white text-center p-8">Verifying access...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#001B3D]/90 to-[#000B1A]/90">
      <div className="w-full max-w-md p-8 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
        <h1 className="text-3xl font-bold text-white mb-4 text-center">
          Verify Your Email
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center text-gray-300 mb-6">
            {email && `Verification code will be sent to ${email}`}
          </div>

          {sendError && <p role="alert" className="text-sm text-red-300">{sendError}</p>}

          {isOtpSent && <p role="status" className="text-sm text-green-300">Check your inbox for the verification code.</p>}

          {isOtpSent && (
            <>
              <OtpInput value={otp} onChange={setOtp} />
              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Submit OTP'}
              </button>
            </>
          )}

          <button
            type="button"
            onClick={handleSendOtp}
            disabled={timeLeft > 0 || isSending}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50"
          >
            {isSending ? 'Sending OTP…' : timeLeft > 0 ? `Resend OTP in ${timeLeft}s` : isOtpSent ? 'Resend OTP' : 'Send OTP to Verify'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerify;