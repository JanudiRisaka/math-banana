import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Timer, Trophy } from 'lucide-react';
import { Button } from '../Layout/Button';
import { useGameStore } from '../../stores/useGameStore';

const DIFFICULTY_SETTINGS = {
  low: { time: 60, multiplier: 1 },
  medium: { time: 45, multiplier: 1.5 },
  hard: { time: 30, multiplier: 2 },
};

const GameBoard = ({ difficulty, onGameOver }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(DIFFICULTY_SETTINGS[difficulty].time);
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const { score, setScore } = useGameStore();
  const timerRef = useRef();
  const mounted = useRef(true);

  const fetchNewQuestion = useCallback(async () => {
    if (!mounted.current) return;

    try {
      setIsLoading(true);
      const response = await fetch('https://marcconrad.com/uob/banana/api.php');
      const data = await response.json();
      if (mounted.current) {
        setCurrentQuestion(data);
        setError('');
      }
    } catch (err) {
      if (mounted.current) {
        setError('Failed to fetch question. Please try again.');
      }
    } finally {
      if (mounted.current) {
        setIsLoading(false);
      }
    }
  }, []);

  // Handle component mount/unmount
  useEffect(() => {
    mounted.current = true;

    // Initial question fetch
    fetchNewQuestion();

    return () => {
      mounted.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [fetchNewQuestion]);

  // Handle timer
  useEffect(() => {
    if (!mounted.current) return;

    timerRef.current = setInterval(() => {
      if (mounted.current) {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            // Call onGameOver after the render
            setTimeout(() => {
              onGameOver(score);
            }, 0);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [difficulty, onGameOver, score]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentQuestion || !mounted.current) return;

    const isCorrect = Number(answer) === currentQuestion.solution;

    if (isCorrect) {
      const points = Math.floor(100 * DIFFICULTY_SETTINGS[difficulty].multiplier);
      setScore(score + points);
      setAnswer('');
      await fetchNewQuestion();
    } else {
      setLives((prev) => {
        const newLives = prev - 1;
        if (newLives === 0) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          // Defer the onGameOver call until after the render cycle
          setTimeout(() => {
            onGameOver(score);
          }, 0);
        }
        return newLives;
      });

      setAnswer('');
    }
  };

  const handleRetry = useCallback(() => {
    if (mounted.current) {
      fetchNewQuestion();
    }
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
            />
          </div>
          <Button
            type="submit"
            variant="fantasy"
            size="lg"
            className="w-full max-w-xs"
            disabled={!answer || isLoading}
          >
            Submit Answer
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default GameBoard;