import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Layout/Button';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  const handleStartGame = () => {
    // Don't perform a fresh auth check, trust the current auth state
    if (isAuthenticated && user) {
      navigate('/game');
    } else {
      navigate('/signin');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-white" />
      </div>
    );
  }

  return (
    <motion.div
      className="col-span-full flex flex-col items-center justify-center text-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-4xl md:text-6xl font-bold mb-4 font-serif mt-10">
        Math Banana Challenge
      </h2>
      <p className="text-xl my-8">Test your math skills with this magical adventure!</p>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="fantasy"
          size="lg"
          className="relative px-12 py-4 text-lg font-semibold"
          onClick={handleStartGame}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <span className="relative z-10">Start Adventure</span>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}