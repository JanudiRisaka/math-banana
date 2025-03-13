import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DifficultySelect from '../components/Game/DifficultySelect';
import GameBoard from '../components/Game/GameBoard';
import GameOver from '../components/Game/GameOver';
import { useGameStore } from '../stores/useGameStore';

const Game = () => {
  const [gameState, setGameState] = useState('difficulty');
  const [difficulty, setDifficulty] = useState('low');
  const { score, setScore } = useGameStore();

  const handleDifficultySelect = useCallback((selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setGameState('playing');
    setScore(0);
  }, [setScore]);


  const saveScoreToDatabase = async (score, userId, won) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Authorization token is missing');
        return;
      }

      const response = await fetch('http://localhost:5000/game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ score: Number(score), userId, won })
      });


      if (!response.ok) {
        const errorDetails = await response.json();
        console.error('Error details:', errorDetails);
        throw new Error('Failed to save score');
      }

      console.log('Score saved successfully');
    } catch (err) {
      console.error('Error saving score:', err);
    }
  };

 // Handle game over and save score to the database
 const handleGameOver = useCallback(() => {
  const userId = "USER_ID"; // Replace with actual user ID (e.g., from your authentication system)
  const won = score > 50; // Example: user wins if the score is above 50 (adjust based on your game rules)

  // Save score and other data to the database
  saveScoreToDatabase(score, userId, won);

  // Continue with your existing logic for handling game over
  setGameState('gameOver');
  }, [score]);

  const handleRestart = useCallback(() => {
    setGameState('difficulty');
    setScore(0);
  }, [setScore]);

  const handleBackToMenu = useCallback(() => {
    setGameState('difficulty');
    setScore(0);
  }, [setScore]);

  return (
    <AnimatePresence mode="wait">
      {gameState === 'difficulty' && (
        <motion.div
          key="difficulty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="col-span-full"
        >
          <DifficultySelect onSelect={handleDifficultySelect} />
        </motion.div>
      )}

      {gameState === 'playing' && (
        <motion.div
          key="game"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="col-span-full"
        >
          <GameBoard
            difficulty={difficulty}
            onGameOver={handleGameOver}
          />
        </motion.div>
      )}

      {gameState === 'gameOver' && (
        <motion.div
          key="gameOver"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="col-span-full"
        >
          <GameOver
            score={score}
            onRestart={handleRestart}
            onBackToMenu={handleBackToMenu}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Game;
