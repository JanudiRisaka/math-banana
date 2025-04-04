// src/components/OtpInput.jsx
// Adapted from: https://youtu.be/7BTsepZ9xp8?si=m817c_k8DdJrgxAH
// Enhanced with error handling and animation features
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * OTP Input Component - Handles 6-digit verification codes with auto-focus and paste support
 * Demonstrates event-driven architecture through keyboard/paste handlers
 */
const OtpInput = ({ value, onChange, error }) => {
  // Refs for input focus management
  const inputRefs = useRef(Array(6).fill(null));
  const otpDigits = value.split('');

  // Event: Handle clipboard paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 6);
    if (pasteData.length === 6) {
      onChange(pasteData);
    }
  };

// Event: Handle individual digit input
  const handleChange = (index, newValue) => {
    if (newValue === '') return;

    const numericValue = newValue.replace(/\D/g, '');
    if (!numericValue) return;

    const newOtp = [...otpDigits];
    newOtp[index] = numericValue.slice(-1);
    onChange(newOtp.join(''));

    // Auto-focus next input
    if (index < 5 && numericValue) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Event: Handle keyboard navigation
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Auto-focus first empty input
  useEffect(() => {
    const firstEmptyIndex = otpDigits.findIndex(digit => !digit);
    if (firstEmptyIndex !== -1) {
      inputRefs.current[firstEmptyIndex].focus();
    }
  }, [otpDigits]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex gap-3 justify-center">
        {Array(6).fill(null).map((_, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <input
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="1"
              value={otpDigits[index] || ''}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`w-14 h-14 text-center text-2xl font-bold rounded-lg border-2 bg-white/5
                ${error ? 'border-red-500' : 'border-white/20 '}
                text-white focus:outline-none focus:ring-2 transition-all`}
            />
          </motion.div>
        ))}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
};

export { OtpInput };