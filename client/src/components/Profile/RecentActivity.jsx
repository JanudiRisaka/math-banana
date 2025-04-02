// RecentActivity.jsx
import React from 'react';
import { Clock, Award } from 'lucide-react';

const activityDefaults = {
  lastGameScore: 0,
  lastPlayed: null,
  dailyStreak: 0
};

const RecentActivity = ({ stats }) => {
  const safeStats = { ...activityDefaults, ...(stats || {}) };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Never played';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        month: 'short',
        day: 'numeric'
      });
    } catch {
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
        <ActivityItem
          icon={<Award className="w-6 h-6 text-green-400" />}
          label="Last Game Score"
          value={safeStats.lastGameScore.toLocaleString()}
        />

        <ActivityItem
          icon={<Clock className="w-6 h-6 text-blue-400" />}
          label="Last Played"
          value={formatDateTime(safeStats.lastPlayed)}
        />

        <ActivityItem
          icon={<div className="w-6 h-6 text-center text-orange-400 font-bold">🔥</div>}
          label="Daily Streak"
          value={`${safeStats.dailyStreak} days`}
        />
      </div>
    </div>
  );
};

const ActivityItem = ({ icon, label, value }) => (
  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg shadow-xl">
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-gray-300">{label}</span>
    </div>
    <span className="text-white font-bold text-lg">{value}</span>
  </div>
);

export default RecentActivity;