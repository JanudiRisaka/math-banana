import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, User, Clock } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

// Leaderboard.jsx
const fetchLeaderboard = async () => {
  try {
    const response = await api.get('http://localhost:5000/game/leaderboard');

    if (response.data && Array.isArray(response.data.leaderboard)) {
      const sortedData = response.data.leaderboard.sort((a, b) => b.highScore - a.highScore);

      const data = sortedData.map(entry => ({
        ...entry,
        last_active: new Date(entry.updatedAt).toLocaleDateString()
      }));

      setLeaderboard(data);
    } else {
      throw new Error('Invalid leaderboard format');
    }
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    // Optionally show error to user:
    // setError(error.response?.data?.message || 'Failed to load leaderboard');
  } finally {
    setLoading(false);
  }
};


  const getRankIcon = (rank) => {
    switch (rank) {
      case 0: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 1: return <Medal className="w-6 h-6 text-gray-300" />;
      case 2: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 flex justify-center">
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
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
          {leaderboard.map((entry, index) => {
            console.log(entry); // Move this log inside the .map() function to inspect entry
            return (
              <motion.div
                key={entry._id} // MongoDB uses _id instead of id
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors ${
                  entry._id === user?._id ? 'border-2 border-yellow-400' : ''
                }`}
              >
                <div className="w-12 text-center">
                  {getRankIcon(index) || (
                    <span className="text-white/80 text-lg">{index + 1}</span>
                  )}
                </div>
                <div className="flex items-center flex-1 px-4">
                  {entry.avatarUrl ? (
                    <img
                      src={entry.avatarUrl}
                      alt={entry.username}
                      className="w-10 h-10 rounded-full mr-3 border border-white/20"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
                      <User className="w-5 h-5 text-gray-300" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-gray-300 font-semibold"> {entry.user?.username || 'Anonymous'}</h3>
                    <div className="flex items-center text-gray-300 text-sm">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>Last active: {entry.last_active}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-yellow-400 font-bold text-xl">
                    {entry.highScore.toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-sm">
                    Level {Math.floor(entry.highScore / 1000)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );


};

export default Leaderboard;