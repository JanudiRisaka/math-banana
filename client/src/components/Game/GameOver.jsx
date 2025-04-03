// src/components/GameOver.jsx
/**
 * Game Over Screen - Displays final results and options
 * Demonstrates component cohesion through focused responsibility
 */
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Home, Flame, Star, Check, X } from 'lucide-react';
import { Button } from '../Layout/Button';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';

const GameOver = ({ score, onRestart }) => {
  // Context usage for state management
  const navigate = useNavigate();
  const { highScore, dailyStreak } = useGame();

  // Determine if the player won based on score
  const hasWon = useMemo(() => score >= 100, [score]);

  const handleNavigation = (path) => {
    navigate(path);
    window.location.reload();
  };

  // Dynamic content based on win/loss
  const titleText = hasWon ? "Victory!" : "Game Over";
  const messageText = hasWon ? "Well done, adventurer!" : "Better luck next time!";

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`backdrop-blur-md rounded-lg border p-8 text-center ${
          hasWon ? "bg-green-900/10 border-green-500/30" : "bg-white/5 border-white/10"
        }`}
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex justify-center mb-6"
        >
          {hasWon ? (
            <Trophy className="w-16 h-16 text-yellow-400" />
          ) : (
            <X className="w-16 h-16 text-red-400" />
          )}
        </motion.div>

        <h2 className="text-4xl font-bold text-white mb-2 font-serif">{titleText}</h2>
        <p className="text-gray-300 mb-4">{messageText}</p>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-6xl font-bold mb-8 ${
            hasWon ? "text-yellow-400" : "text-white"
          }`}
        >
          {score.toLocaleString()}
        </motion.div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <h3 className="text-sm text-gray-300">Daily Streak</h3>
            </div>
            <div className="text-2xl font-bold text-green-400">{dailyStreak}</div>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm text-gray-300">All-Time Best</h3>
            </div>
            <div className="text-2xl font-bold text-purple-400">{highScore.toLocaleString()}</div>
          </div>
        </div>

        {/* Add status indicator for win/loss */}
        <div className="mb-6 flex items-center justify-center">
          <div className={`flex items-center px-4 py-2 rounded-full ${
            hasWon ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
          }`}>
            {hasWon ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                <span>Win!</span>
              </>
            ) : (
              <>
                <X className="w-5 h-5 mr-2" />
                <span>Try to score at least 100 points to win</span>
              </>
            )}
          </div>
        </div>

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
            onClick={() => handleNavigation('/')}
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