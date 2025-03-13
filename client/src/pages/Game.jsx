import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
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


  const saveScoreToDatabase = async (score, won) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Authorization token is missing');
        return;
      }

      const response = await fetch('http://localhost:5000/game/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ score: Number(score), won }), // No need to send userId here
      });

      const responseData = await response.json(); // Log full response
      console.log('Server response:', responseData);

      if (!response.ok) {
        console.error('Failed to save score:', responseData);
        return;
      }

      console.log('Score saved successfully');
    } catch (err) {
      console.error('Error saving score:', err);
    }
  };

 // Handle game over and save score to the database
 const handleGameOver = useCallback(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Authorization token is missing');
    return;
  }

  try {
    const decoded = jwtDecode(token);
    console.log('Decoded token:', decoded); // Log token payload

    const userId = decoded?.userId; // Ensure this matches your JWT payload
    if (!userId) {
      console.error('User ID missing from token');
      return;
    }

    console.log('User ID:', userId);
    const won = score > 50; // Example win condition

    saveScoreToDatabase(score, userId, won);
    setGameState('gameOver');
  } catch (error) {
    console.error('Failed to decode token:', error);
  }
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
