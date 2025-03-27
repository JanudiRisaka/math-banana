import React from 'react';
import { useLocation } from 'react-router-dom';

const VerifyEmailPending = () => {
  const { state } = useLocation();
  const email = state?.email || 'your email';

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md p-6 bg-white/5 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
        <p className="mb-4">
          We've sent a verification link to <span className="text-yellow-400">{email}</span>.
          Please check your inbox and click the link to activate your account.
        </p>
        <p className="text-sm text-gray-400">
          Didn't receive the email? Check your spam folder or
          <button className="text-yellow-400 ml-1 hover:underline">
            resend verification email
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPending;