import { createContext, useContext, useState, useCallback, useRef } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [error, setError] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(false);

  // Add a saveInProgress ref to prevent duplicate saves
  const saveInProgress = useRef(false);

  const saveScore = useCallback(async (scoreOrData, wonParam = undefined) => {
    // Prevent duplicate saves
    if (saveInProgress.current) {
      console.log('[DEBUG] Save already in progress, skipping duplicate request');
      return;
    }

    saveInProgress.current = true;

    // Handle both parameter styles:
    // 1. saveScore(400, true)
    // 2. saveScore({ finalScore: 400, won: true })
    let finalScore, won;

    if (typeof scoreOrData === 'object' && scoreOrData !== null) {
      // Handle object parameter style
      finalScore = scoreOrData.finalScore;
      won = scoreOrData.won;
    } else {
      // Handle individual parameters style
      finalScore = scoreOrData;
      won = wonParam;
    }

    console.log('[DEBUG] Processed saveScore params:', { finalScore, won });

    try {
      console.log('[DEBUG] Sending to:', `${import.meta.env.VITE_API_BASE_URL}/api/game/scores`);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/game/scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Cookies will be sent automatically.
        body: JSON.stringify({ score: finalScore, won }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[Frontend] Save score error response:', errorData);
        throw new Error(errorData.message || 'Score save failed');
      }

      const data = await response.json();
      // Reset the game score and update highScore if necessary.
      setHighScore(prev => Math.max(prev, finalScore));
      console.log('[Frontend] Save score success:', data);
      return data;
    } catch (error) {
      console.error('[Frontend] Score save error:', error);
      setError(error.message);
      throw error;
    } finally {
      // Always reset the saveInProgress flag, even on error
      saveInProgress.current = false;
    }
  }, []);

  const fetchLeaderboard = useCallback(async () => {
    setIsLeaderboardLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/game/leaderboard`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch leaderboard');

      const { data } = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid leaderboard data format');
      }

      const processedData = data.map(entry => ({
        user: entry.user,
        highScore: entry.highScore,
        last_active: entry.updatedAt ? new Date(entry.updatedAt).toLocaleDateString() : 'N/A'
      }));
      setLeaderboard(processedData);
    } catch (error) {
      console.error('Leaderboard fetch error:', error);
      setError(error.message);
    } finally {
      setIsLeaderboardLoading(false);
    }
  }, []);

  const resetGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setIsGameOver(false);
    setError(null);
    // Reset the saveInProgress flag when starting a new game
    saveInProgress.current = false;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <GameContext.Provider
      value={{
        score,
        setScore,
        highScore,
        setHighScore,
        lives,
        setLives,
        isGameOver,
        setIsGameOver,
        resetGame,
        saveScore,
        leaderboard,
        fetchLeaderboard,
        isLeaderboardLoading,
        error,
        clearError
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};