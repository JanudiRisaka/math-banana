// Manages global game state including score, lives, high score, streak, and provides game-related actions.
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const GameContext = createContext();

export function GameProvider({ children }) {
  const { isAuthenticated } = useAuth();

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [highScore, setHighScore] = useState(0);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [lastPlayedDate, setLastPlayedDate] = useState(null);
  const [lastGameScore, setLastGameScore] = useState(0);

  // Axios instance with base configuration
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
  });

  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        window.location.href = '/signin';
      }
      return Promise.reject(error);
    }
  );

  // Fetch user stats on initial load
  const fetchUserStats = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      const { data } = await api.get('/api/game/stats');

      if (data.success) {
        setHighScore(data.data.highScore || 0);
        setDailyStreak(data.data.dailyStreak || 0);
        setLastPlayedDate(data.data.lastPlayedDate || null);
        setLastGameScore(data.data.lastGameScore || 0);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load user stats');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Initialize user data when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserStats();
    }
  }, [isAuthenticated, fetchUserStats]);

// Add to your resetGame function
const resetGame = useCallback(() => {
  setScore(0);
  setLives(3);
  setIsGameOver(false);
  setError(null);

  // Refresh user stats if authenticated
  if (isAuthenticated) {
    fetchUserStats();
  }
}, [isAuthenticated, fetchUserStats]);

  const saveScore = useCallback(async (finalScore, won) => {
    if (!isAuthenticated) {
      return Promise.reject(new Error('Not authenticated'));
    }

    setIsLoading(true);
    try {
      // Include the current date in the request to help the server calculate streaks
      const today = new Date();

      const { data } = await api.post('/api/game/scores', {
        score: finalScore,
        playedDate: today
      });

      if (data.success) {
        // Update state with new values from backend
        setHighScore(data.data.highScore);
        setDailyStreak(data.data.dailyStreak);
        setLastPlayedDate(today);
        setLastGameScore(finalScore);
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to save score');
      }
    } catch (error) {
      console.error('Error saving score:', error);
      setError(error.response?.data?.message || error.message || 'Failed to save score');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/api/game/leaderboard');

      if (data.success) {
        setLeaderboard(
          data.data.map(entry => ({
            ...entry,
            _id: entry._id || `leaderboard-${Math.random()}`,
            user: entry.user || { username: 'Anonymous', avatar: '' },
            highScore: entry.highScore || 0
          }))
        );
      } else {
        throw new Error(data.message || 'Failed to load leaderboard');
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Automatically fetch leaderboard on mount if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchLeaderboard();
    }
  }, [fetchLeaderboard, isAuthenticated]);

  const value = {
    // State
    score,
    lives,
    isGameOver,
    leaderboard,
    isLoading,
    error,
    highScore,
    dailyStreak,
    lastPlayedDate,
    lastGameScore,
    setLastGameScore,

    // Methods
    resetGame,
    saveScore,
    fetchLeaderboard,
    fetchUserStats,

    // Setters
    setScore,
    setLives,
    setIsGameOver,
    setError
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};