// ProfileStats.jsx
import React from 'react';
import { Trophy, GamepadIcon, Calendar } from 'lucide-react';

const statDefaults = {
  highScore: 0,
  gamesPlayed: 0,
  avgScore: 0,
  lastPlayed: null,
  lastGameScore: 0,
  dailyStreak: 0
};

const ProfileStats = ({ stats }) => {
  const mergedStats = { ...statDefaults, ...(stats || {}) };

  const formatNumber = (value) =>
    typeof value === 'number' ? value.toLocaleString() : 'N/A';

  const formatDate = (dateString) => {
    if (!dateString) return 'Never played';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
      <StatCard
        icon={<Trophy className="w-8 h-8 text-yellow-400" />}
        label="High Score"
        value={formatNumber(mergedStats.highScore)}
      />

      <StatCard
        icon={<GamepadIcon className="w-8 h-8 text-yellow-400" />}
        label="Games Played"
        value={formatNumber(mergedStats.gamesPlayed)}
      />

      <StatCard
        icon={<Trophy className="w-8 h-8 text-yellow-400" />}
        label="Avg. Score"
        value={formatNumber(Math.round(mergedStats.avgScore))}
      />

      <StatCard
        icon={<Calendar className="w-8 h-8 text-yellow-400" />}
        label="Last Played"
        value={formatDate(mergedStats.lastPlayed)}
      />
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="text-center p-4 shadow-xl rounded-lg transition-all">
    <div className="mx-auto mb-2">{icon}</div>
    <p className="text-sm text-gray-300">{label}</p>
    <p className="text-xl font-bold text-white">{value}</p>
  </div>
);

export default ProfileStats;