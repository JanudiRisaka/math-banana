import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Timer, Trophy } from 'lucide-react';
import { Button } from '../Layout/Button';
import { useGame } from '../../context/GameContext';

const DIFFICULTY_SETTINGS = {
  low: { time: 60, multiplier: 1 },
  medium: { time: 45, multiplier: 1.5 },
  hard: { time: 30, multiplier: 2 },
};

const GameBoard = ({ difficulty, onGameOver }) => {
  const {
    score,
    setScore,
    lives,
    setLives,
    setIsGameOver,
    saveScore
  } = useGame();

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(DIFFICULTY_SETTINGS[difficulty].time);
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const timerRef = useRef();
  const mounted = useRef(true);

  const fetchNewQuestion = useCallback(async () => {
    if (!mounted.current) return;
    try {
      setIsLoading(true);
      const response = await fetch('https://marcconrad.com/uob/banana/api.php');
      const data = await response.json();
      mounted.current && setCurrentQuestion(data);
    } catch (err) {
      mounted.current && setError('Failed to fetch question. Please try again.');
    } finally {
      mounted.current && setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    fetchNewQuestion();
    return () => {
      mounted.current = false;
      clearInterval(timerRef.current);
    };
  }, [fetchNewQuestion]);

  const handleGameEnd = useCallback(async (finalScore, won) => {
    if (isSaving || !mounted.current) return;

    try {
      setIsSaving(true);
      clearInterval(timerRef.current);
      setIsGameOver(true);

      await saveScore(finalScore, won);
      onGameOver(finalScore);
    } catch (err) {
      console.error("Error ending game:", err);
      setError(`Failed to save score: ${err.message}`);
      onGameOver(finalScore);
    } finally {
      setIsSaving(false);
    }
  }, [saveScore, onGameOver, setIsGameOver, isSaving]);

  useEffect(() => {
    if (!mounted.current) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          // Don't call handleGameEnd here, just prepare for it
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [difficulty]);

  // Effect to handle time-out game over
  useEffect(() => {
    if (timeLeft === 0 && mounted.current) {
      handleGameEnd(score, score > 50);
    }
  }, [timeLeft, score, handleGameEnd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentQuestion || !mounted.current || isSaving) return;

    const isCorrect = Number(answer) === currentQuestion.solution;

    if (isCorrect) {
      const points = Math.floor(100 * DIFFICULTY_SETTINGS[difficulty].multiplier);
      setScore(prev => prev + points);
      setAnswer('');
      await fetchNewQuestion();
    } else {
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives === 0) {
          // Queue the game end but don't call immediately to avoid race conditions
          setTimeout(() => handleGameEnd(score, false), 0);
        }
        return newLives;
      });
      setAnswer('');
    }
  };

  const handleRetry = useCallback(() => {
    mounted.current && fetchNewQuestion();
  }, [fetchNewQuestion]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-md rounded-lg border border-white/10 p-6"
      >
        {/* Game Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className={`w-6 h-6 ${i < lives ? 'text-red-500' : 'text-gray-500'}`}
                fill={i < lives ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Timer className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-mono text-xl">{timeLeft}s</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-mono text-xl">{score}</span>
            </div>
          </div>
        </div>

        {/* Question Display */}
        <div className="mb-8">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center h-64"
              >
                <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-red-400 text-center p-4"
              >
                {error}
                <Button
                  variant="fantasy"
                  onClick={handleRetry}
                  className="mt-4"
                >
                  Try Again
                </Button>
              </motion.div>
            ) : currentQuestion && (
              <motion.div
                key="question"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <img
                  src={currentQuestion.question}
                  alt="Math Question"
                  className="max-w-full h-auto rounded-lg shadow-lg mb-6"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Answer Input */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="mb-4">
            <input
              type="number"
              min="0"
              max="9"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-24 h-24 text-4xl text-center bg-white/5 border-2 border-yellow-400/50 rounded-lg focus:border-yellow-400 focus:outline-none text-white"
              placeholder="?"
              disabled={isSaving}
            />
          </div>
          <Button
            type="submit"
            variant="fantasy"
            size="lg"
            className="w-full max-w-xs"
            disabled={!answer || isLoading || isSaving}
          >
            Submit Answer
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default GameBoard;