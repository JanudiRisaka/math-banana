import React from 'react';
import { Clock, Award } from 'lucide-react';

const RecentActivity = ({ stats }) => {
  console.log("RecentActivity received stats:", stats); // Debug log

  // Safely handle null/undefined stats
  const safeStats = {
    lastGameScore: 0,
    lastPlayed: null,
    dailyStreak: 0,
    ...(stats || {}) // Only spread if stats exists
  };

  console.log("RecentActivity using stats:", safeStats); // Debug what's used

  const formatDate = (dateString) => {
    if (!dateString) return 'Never played';
    try {
      const options = {
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'short'
      };
      return new Date(dateString).toLocaleString(undefined, options);
    } catch (error) {
      console.error("Date formatting error:", error);
      return 'Invalid date';
    }
  };

  return (
    <div className="p-6 border-t border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-yellow-400 flex items-center gap-2">
        <Clock className="w-6 h-6" />
        Recent Activity
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-green-400" />
            <span className="text-gray-300">Last Game Score</span>
          </div>
          <span className="text-white font-bold text-lg">
            {safeStats.lastGameScore ? safeStats.lastGameScore.toLocaleString() : 'N/A'}
          </span>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-blue-400" />
            <span className="text-gray-300">Last Played</span>
          </div>
          <span className="text-white font-bold text-lg">
            {formatDate(safeStats.lastPlayed)}
          </span>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 text-center text-orange-400 font-bold">🔥</div>
            <span className="text-gray-300">Daily Streak</span>
          </div>
          <span className="text-white font-bold text-lg">
            {safeStats.dailyStreak} days
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;