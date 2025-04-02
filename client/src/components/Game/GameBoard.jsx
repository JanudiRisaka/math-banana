import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Timer, Trophy } from 'lucide-react';
import { Button } from '../Layout/Button';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext'; // Import AuthContext

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
    isGameOver,
    setIsGameOver,
    saveScore
  } = useGame();

  // Use the AuthContext
  const { isAuthenticated, user } = useAuth();

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(DIFFICULTY_SETTINGS[difficulty].time);
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const timerRef = useRef(null);
  const mounted = useRef(true);

  const fetchNewQuestion = useCallback(async () => {
    if (!mounted.current) return;
    try {
      setIsLoading(true);
      const response = await fetch('https://marcconrad.com/uob/banana/api.php');
      const data = await response.json();
      if (mounted.current) setCurrentQuestion(data);
    } catch (err) {
      if (mounted.current) setError('Failed to fetch question. Please try again.');
    } finally {
      if (mounted.current) setIsLoading(false);
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

  useEffect(() => {
    const endGame = async () => {
      clearInterval(timerRef.current);
      if (mounted.current) {
        // First save the score, then set game over state
        try {
          // Only try to save score if authenticated
          if (isAuthenticated) {
            await saveScore(score, lives > 0);
          }
        } catch (error) {
          console.error("Failed to save score:", error);
        } finally {
          setIsGameOver(true);
          onGameOver(score);
        }
      }
    };

    if ((lives <= 0 || timeLeft <= 0) && !isGameOver) {
      // Use isAuthenticated from AuthContext
      if (isAuthenticated) {
        endGame();
      } else {
        setIsGameOver(true);
        onGameOver(score);
      }
    }
  }, [lives, timeLeft, score, isGameOver, onGameOver, saveScore, setIsGameOver, isAuthenticated]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [difficulty]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentQuestion || isGameOver) {
      return;
    }

    // Check authentication using AuthContext
    if (!isAuthenticated) {
      // Store current game state in sessionStorage
      sessionStorage.setItem('gameState', JSON.stringify({ score, lives, difficulty }));

      // Show error and redirect to login after a short delay
      setError('Please log in to submit your answer. Redirecting to login page...');

      setTimeout(() => {
        window.location.href = '/signin';
      }, 2000);

      return;
    }

    const isCorrect = Number(answer) === currentQuestion.solution;
    try {
      if (isCorrect) {
        const points = Math.floor(100 * DIFFICULTY_SETTINGS[difficulty].multiplier);
        setScore(prev => prev + points);
        setAnswer('');
        await fetchNewQuestion();
      } else {
        setLives(prev => {
          const newLives = prev - 1;
          return Math.max(0, newLives);
        });
        setAnswer('');
      }
    } catch (error) {
      if (mounted.current) {
        setError(`Error: ${error.message}`);
      }
    }
  };

  const handleRetry = useCallback(() => {
    if (mounted.current) {
      setError('');
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
        {/* Authentication Status - Optional UI indicator */}
        {!isAuthenticated && (
          <div className="bg-amber-500/20 border border-amber-500/50 text-amber-200 px-4 py-2 rounded-md mb-4 text-sm flex items-center justify-between">
            <span>Playing as guest. Log in to save your scores!</span>
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                sessionStorage.setItem('gameState', JSON.stringify({ score, lives, difficulty }));
                window.location.href = '/signin';
              }}
            >
              Login
            </Button>
          </div>
        )}

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
              onChange={(e) => {
                if (e.target.value === '') {
                  setAnswer('');
                  return;
                }
                const value = Math.min(9, Math.max(0, parseInt(e.target.value) || 0));
                setAnswer(value.toString());
              }}
              className="w-24 h-24 text-4xl text-center bg-white/5 border-2 border-yellow-400/50 rounded-lg focus:border-yellow-400 focus:outline-none text-white"
              placeholder="?"
            />
          </div>
          <Button
            type="submit"
            variant="fantasy"
            size="lg"
            className="w-full max-w-xs"
            disabled={!answer || isLoading || isGameOver}
          >
            Submit Answer
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default GameBoard;