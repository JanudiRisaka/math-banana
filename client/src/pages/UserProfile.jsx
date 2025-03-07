import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Star, Award, Clock, Target, Share2, Edit, Trophy, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Layout/Button';

const UserProfile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [user?.id]);

  const fetchUserData = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setStats({
        games_played: data.games_played || 0,
        high_score: data.high_score || 0,
        win_ratio: 0.75,
        total_time: 7200,
      });

      setAchievements([
        {
          id: '1',
          name: 'Math Prodigy',
          description: 'Solve 100 problems correctly',
          icon: <Star className="w-6 h-6" />,
          unlocked: true,
        },
        {
          id: '2',
          name: 'Speed Demon',
          description: 'Complete a level in under 30 seconds',
          icon: <Clock className="w-6 h-6" />,
          unlocked: true,
        },
        {
          id: '3',
          name: 'Perfect Score',
          description: 'Achieve 100% accuracy in a game',
          icon: <Target className="w-6 h-6" />,
          unlocked: false,
        },
        {
          id: '4',
          name: 'Champion',
          description: 'Reach the top of the leaderboard',
          icon: <Trophy className="w-6 h-6" />,
          unlocked: false,
        },
      ]);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: filePath })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      fetchUserData();
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Profile link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing profile:', error);
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
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
          <div className="relative group">
            {user?.avatar_url ? (
              <img 
                src={user.avatar_url}
                alt="Profile" 
                className="w-32 h-32 rounded-full border-4 border-yellow-400 object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center border-4 border-yellow-400">
                <User className="w-16 h-16 text-yellow-400" />
              </div>
            )}
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              {uploading ? (
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              ) : (
                <span className="text-white text-sm">Change Avatar</span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          {/* Rest of the JSX remains unchanged */}
          {/* ... */}
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;