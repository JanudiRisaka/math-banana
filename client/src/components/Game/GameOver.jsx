import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Home } from 'lucide-react';
import { Button } from '../Layout/Button';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../stores/useGameStore';
import axios from 'axios'; // Import axios for HTTP requests

const GameOver = ({ score, onRestart, onBackToMenu }) => {
  const navigate = useNavigate();
  const { resetGame } = useGameStore();

  // Function to send game data to the backend
  const saveGameData = async () => {
    try {
      const response = await axios.post('/game', { score, won: score > 100 }); // Example condition for 'won'
      console.log('Game data saved:', response.data);
    } catch (error) {
      console.error('Error saving game data:', error);
    }
  };

  useEffect(() => {
    saveGameData(); // Save game data when component mounts
  }, []);

  const handleBackToMenu = () => {
    resetGame();
    navigate('/');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 backdrop-blur-md rounded-lg border border-white/10 p-8 text-center"
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex justify-center mb-6"
        >
          <Trophy className="w-16 h-16 text-yellow-400" />
        </motion.div>

        <h2 className="text-4xl font-bold text-white mb-2 font-serif">Game Over!</h2>
        <p className="text-gray-300 mb-4">Well played, adventurer!</p>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-6xl font-bold text-yellow-400 mb-8"
        >
          {score}
        </motion.div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            variant="fantasy"
            size="lg"
            onClick={onRestart}
            className="group"
          >
            <RotateCcw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
            Try Again
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={handleBackToMenu}
            className="text-white hover:text-yellow-400"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Menu
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default GameOver;
