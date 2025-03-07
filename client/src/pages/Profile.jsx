import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import { User, Trophy, GamepadIcon, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-banana-dark p-8 text-center">
          <div className="inline-block p-4 rounded-full bg-white mb-4">
            <User className="w-12 h-12 text-banana-dark" />
          </div>
          <h1 className="text-2xl font-bold text-white">{user.username}</h1>
          <p className="text-banana-light">{user.email}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Trophy className="w-8 h-8 text-banana-dark mx-auto mb-2" />
            <p className="text-sm text-gray-600">High Score</p>
            <p className="text-xl font-bold">{user.stats.highScore}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <GamepadIcon className="w-8 h-8 text-banana-dark mx-auto mb-2" />
            <p className="text-sm text-gray-600">Games Played</p>
            <p className="text-xl font-bold">{user.stats.gamesPlayed}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Trophy className="w-8 h-8 text-banana-dark mx-auto mb-2" />
            <p className="text-sm text-gray-600">Wins</p>
            <p className="text-xl font-bold">{user.stats.wins}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Calendar className="w-8 h-8 text-banana-dark mx-auto mb-2" />
            <p className="text-sm text-gray-600">Daily Streak</p>
            <p className="text-xl font-bold">{user.dailyStreak.count}</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-6 border-t">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600">Last Game Score: {user.stats.lastGameScore}</p>
            <p className="text-gray-600">
              Last Played: {new Date(user.dailyStreak.lastPlayed).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => navigate('/')}
          >
            Back to Menu
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Profile;