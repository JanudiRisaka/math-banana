import React from 'react';

const RecentActivity = ({ stats }) => (
  <div className="p-6 border-t border-gray-600">
    <h2 className="text-xl font-semibold mb-4 text-gray-300">Recent Activity</h2>
    <div className="bg-gray-50 rounded-lg p-4">
      <p className="text-gray-600">
        Last Game Score: {stats?.lastGameScore || 'N/A'}
      </p>
      <p className="text-gray-600">
        Last Played: {stats?.lastPlayed ? new Date(stats.lastPlayed).toLocaleDateString() : 'N/A'}
      </p>
    </div>
  </div>
);

export default RecentActivity;
