import React from 'react';
import { Trophy, GamepadIcon, Calendar } from 'lucide-react';

const ProfileStats = ({ stats }) => {
  console.log("ProfileStats received:", stats); // Debug what's received

  // Ensure we have proper default values for all stats
  const mergedStats = {
    highScore: 0,
    gamesPlayed: 0,
    avgScore: 0,
    lastPlayed: null,
    lastGameScore: 0,
    ...(stats || {}) // Only spread if stats is not null/undefined
  };

  console.log("ProfileStats using:", mergedStats); // Debug what's used

  const formatValue = (value) => {
    if (typeof value === 'number') return value.toLocaleString();
    return value || 'N/A';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
      {/* High Score */}
      <div className="text-center p-4 bg-gray-800 rounded-lg transition-all hover:bg-gray-700">
        <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
        <p className="text-sm text-gray-300">High Score</p>
        <p className="text-xl font-bold text-white">
          {formatValue(mergedStats.highScore)}
        </p>
      </div>

      {/* Games Played */}
      <div className="text-center p-4 bg-gray-800 rounded-lg transition-all hover:bg-gray-700">
        <GamepadIcon className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
        <p className="text-sm text-gray-300">Games Played</p>
        <p className="text-xl font-bold text-white">
          {formatValue(mergedStats.gamesPlayed)}
        </p>
      </div>

      {/* Average Score */}
      <div className="text-center p-4 bg-gray-800 rounded-lg transition-all hover:bg-gray-700">
        <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
        <p className="text-sm text-gray-300">Avg. Score</p>
        <p className="text-xl font-bold text-white">
          {mergedStats.avgScore > 0
            ? Math.round(mergedStats.avgScore).toLocaleString()
            : 'N/A'}
        </p>
      </div>

      {/* Last Played */}
      <div className="text-center p-4 bg-gray-800 rounded-lg transition-all hover:bg-gray-700">
        <Calendar className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
        <p className="text-sm text-gray-300">Last Played</p>
        <p className="text-xl font-bold text-white">
          {formatDate(mergedStats.lastPlayed)}
        </p>
      </div>
    </div>
  );
};

export default ProfileStats;