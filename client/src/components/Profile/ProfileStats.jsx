import React from 'react';
import { Trophy, Gamepad, Calendar, Award, Flame } from 'lucide-react';

const statDefaults = {
  highScore: 0,
  gamesPlayed: 0,
  wins: 0,
  dailyStreak: 0,
  lastPlayed: null,
  lastGameScore: 0
};

const ProfileStats = ({ stats }) => {
  const mergedStats = { ...statDefaults, ...(stats || {}) };

  const formatNumber = (value) =>
    typeof value === 'number' ? value.toLocaleString() : 'N/A';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
      <StatCard
        icon={<Trophy className="w-8 h-8 text-yellow-400" />}
        label="High Score"
        value={formatNumber(mergedStats.highScore)}
      />

      <StatCard
        icon={<Gamepad className="w-8 h-8 text-blue-400" />}
        label="Games Played"
        value={formatNumber(mergedStats.gamesPlayed)}
      />

<StatCard
  icon={<Award className="w-8 h-8 text-green-400" />}
  label="Wins"
  value={formatNumber(mergedStats.wins)}
/>

      <StatCard
        icon={<Flame className="w-8 h-8 text-orange-400" />}
        label="Daily Streak"
        value={`${formatNumber(mergedStats.dailyStreak)} days`}
      />
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="text-center p-4 shadow-xl rounded-lg transition-all bg-gray-800 hover:bg-gray-700">
    <div className="mx-auto mb-2">{icon}</div>
    <p className="text-sm text-gray-300">{label}</p>
    <p className="text-xl font-bold text-white">{value}</p>
  </div>
);

export default ProfileStats;