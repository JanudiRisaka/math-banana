import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import sparklesData from '../assets/animations/Sparkles.json';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Layout/Button';
import { Loader2 } from 'lucide-react';
import bananaImage from '../assets/images/banana1.png';

const Sparkles = ({ top, left }) => {
  return (
    <div
      className="absolute -translate-x-90 -translate-y-20 pointer-events-none"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        width: '50px',
        height: '100px',
      }}
    >
      <Lottie
        animationData={sparklesData}
        loop
        autoplay
        className="w-full h-full"
      />
    </div>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  const handleStartGame = () => {
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
      className="col-span-full flex flex-col items-center justify-center text-white relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="relative z-10 w-full max-w-7xl px-4 md:px-8">
        <Sparkles top={20} left={10} />
        <Sparkles top={70} left={30} />
        <Sparkles top={40} left={85} />

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 font-serif">
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
          </div>

          <div className="flex-1 flex justify-center md:justify-end">
            <motion.img
              src={bananaImage}
              alt="Magical Banana"
              className="w-full max-w-[280px] md:max-w-[400px] transition-transform hover:scale-105 drop-shadow-[0_25px_25px_rgba(255,225,0,0.7)]"
              animate={{
                x: [0, 20, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}