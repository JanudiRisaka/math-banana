import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, User, Clock } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';

const Leaderboard = () => {
  const { user } = useAuth();
  const { leaderboard, fetchLeaderboard, isLeaderboardLoading, error, clearError } = useGame();

  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.split(' ');
    return names
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Add safe value handling
  const getSafeHighScore = (entry) => {
    // Check both possible locations for the score
    return entry.highScore ?? entry.score ?? 0;
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 0: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 1: return <Medal className="w-6 h-6 text-gray-300" />;
      case 2: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return null;
    }
  };

  if (isLeaderboardLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 flex justify-center">
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 text-red-400 text-center">
        {error}
        <button
          onClick={clearError}
          className="mt-2 text-yellow-400 hover:text-yellow-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-md rounded-lg border border-white/10 p-6"
      >
        <div className="flex items-center justify-center mb-8">
          <Trophy className="w-8 h-8 text-yellow-400 mr-3" />
          <h2 className="text-3xl font-bold text-white font-serif">Leaderboard</h2>
        </div>

        <div className="space-y-4">
          {leaderboard.map((entry, index) => (
            <motion.div
              key={entry._id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors ${
                entry.user?._id === user?._id ? 'border-2 border-yellow-400' : ''
              }`}
            >
              <div className="w-12 text-center">
                {getRankIcon(index) || (
                  <span className="text-white/80 text-lg">{index + 1}</span>
                )}
              </div>
              <div className="flex items-center flex-1 px-4">
                {entry.user?.avatar ? (
                  <img
                    src={entry.user.avatar}
                    alt={entry.user.username}
                    className="w-10 h-10 rounded-full mr-3 border border-white/20"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
                    <span className="text-gray-300 text-sm font-medium">
                      {getInitials(entry.user?.username)}
                    </span>
                  </div>
                )}
<div>
                  <h3 className="text-gray-300 font-semibold">
                    {entry.user?.username || 'Anonymous'}
                  </h3>
                  <div className="flex items-center text-gray-300 text-sm">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>Last active: {entry.last_active || 'N/A'}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-yellow-400 font-bold text-xl">
                  {/* Add safe value handling */}
                  {getSafeHighScore(entry).toLocaleString()}
                </div>
                <div className="text-gray-400 text-sm">
                  Level {Math.floor(getSafeHighScore(entry) / 1000)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;