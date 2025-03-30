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
      const response = await fetch('http://localhost:5000/game/scores', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          score: Number(score),
          won
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Score save failed');
      }

      return responseData;
    } catch (err) {
      console.error('Score save error:', err.message);
      throw new Error(`Could not save score: ${err.message}`);
    }
  };

  const handleGameOver = useCallback(async () => {
    try {
      await saveScoreToDatabase(score, score > 50);
      setGameState('gameOver');
    } catch (err) {
      console.error('Game over error:', err.message);
      // Optionally show error to user
      alert(err.message);
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
