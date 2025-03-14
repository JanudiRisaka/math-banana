import React from 'react';
import { Trophy, GamepadIcon, Calendar } from 'lucide-react';

const ProfileStats = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
    <div className="text-center p-4 bg-gray-100 rounded-lg">
      <Trophy className="w-8 h-8 text-banana-dark mx-auto mb-2" />
      <p className="text-sm text-gray-600">High Score</p>
      <p className="text-xl font-bold">{stats?.highScore || 'N/A'}</p>
    </div>
    <div className="text-center p-4 bg-gray-50 rounded-lg">
      <GamepadIcon className="w-8 h-8 text-banana-dark mx-auto mb-2" />
      <p className="text-sm text-gray-600">Games Played</p>
      <p className="text-xl font-bold">{stats?.gamesPlayed || 'N/A'}</p>
    </div>
    <div className="text-center p-4 bg-gray-50 rounded-lg">
      <Trophy className="w-8 h-8 text-banana-dark mx-auto mb-2" />
      <p className="text-sm text-gray-600">Wins</p>
      <p className="text-xl font-bold">{stats?.wins || 'N/A'}</p>
    </div>
    <div className="text-center p-4 bg-gray-50 rounded-lg">
      <Calendar className="w-8 h-8 text-banana-dark mx-auto mb-2" />
      <p className="text-sm text-gray-600">Daily Streak</p>
      <p className="text-xl font-bold">{stats?.dailyStreak || 'N/A'}</p>
    </div>
  </div>
);

export default ProfileStats;
