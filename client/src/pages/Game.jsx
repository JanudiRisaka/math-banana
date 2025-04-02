import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DifficultySelect from '../components/Game/DifficultySelect';
import GameBoard from '../components/Game/GameBoard';
import GameOver from '../components/Game/GameOver';
import { useGame } from '../context/GameContext';

const Game = () => {
  const [gameState, setGameState] = useState('difficulty');
  const [difficulty, setDifficulty] = useState('low');
  const [finalScore, setFinalScore] = useState(0);
  const { resetGame } = useGame();

  // Clean up on component mount
  useEffect(() => {
    resetGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDifficultySelect = useCallback((selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setGameState('playing');
    resetGame();
  }, [resetGame]);

  const handleGameOver = useCallback((score) => {
    setFinalScore(score);
    setGameState('gameOver');
  }, []);

  const handleRestart = useCallback(() => {
    setGameState('difficulty');
    resetGame();
  }, [resetGame]);

  return (
    <AnimatePresence mode="wait">
      {gameState === 'difficulty' && (
        <motion.div key="difficulty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <DifficultySelect onSelect={handleDifficultySelect} />
        </motion.div>
      )}

      {gameState === 'playing' && (
        <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <GameBoard difficulty={difficulty} onGameOver={handleGameOver} />
        </motion.div>
      )}

      {gameState === 'gameOver' && (
        <motion.div key="gameOver" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <GameOver score={finalScore} onRestart={handleRestart} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Game;