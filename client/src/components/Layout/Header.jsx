import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Volume2, VolumeX, Trophy, User, Info, Share2, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import backgroundMusic from '../../assets/Genshin Impact Main Theme.mp3';

function Header() {
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();

  // Local state for managing audio mute status
  const [isMuted, setIsMuted] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [audioMuted, audioToggleMute] = useAudio(backgroundMusic, isMuted);

  // Reset avatar error state when user changes and force component update
  useEffect(() => {
    setAvatarError(false);
  }, [user]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Math Banana',
        text: 'Check out this awesome math game!',
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    audioToggleMute();
  };

  const renderUserAvatar = () => {
    if (!user) return null;

    // Use initials as fallback if avatar fails or is not available
    if (!user.avatar || avatarError) {
      // Check if we have a username to generate initials
      if (user.username) {
        return (
          <div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full border-2 border-yellow-400">
            <span className="text-yellow-400 font-semibold">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>
        );
      } else {
        // Fallback to user icon if no username
        return (
          <div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full border-2 border-yellow-400">
            <User className="w-5 h-5 text-yellow-400" />
          </div>
        );
      }
    }

    // Display avatar if available
    return (
      <img
        src={user.avatar + `?${new Date().getTime()}`} // Force image refresh
        alt="User Avatar"
        className="w-8 h-8 rounded-full border-2 border-yellow-400 object-cover"
        onError={() => setAvatarError(true)}
      />
    );
  };

  return (
    <header id="game-header" className="relative flex items-center justify-between mb-8 p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md">
      <button
        onClick={handleLogoClick}
        className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
      >
        <Sparkles className="w-8 h-8 text-yellow-400" />
        <h1 className="text-3xl font-bold text-white font-serif">Math Banana</h1>
      </button>
      <nav className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleMute}
          className="text-white hover:text-yellow-400 transition-all duration-300"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-yellow-400 transition-all duration-300"
          onClick={() => navigate('/help')}
        >
          <Info />
        </Button>
        {isAuthenticated && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/leaderboard')}
            className="text-white hover:text-yellow-400 transition-all duration-300"
          >
            <Trophy />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleShare}
          className="text-white hover:text-yellow-400 transition-all duration-300"
          title="Share"
        >
          <Share2 />
        </Button>
        {isAuthenticated ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
            >
              <div className="relative">
                {renderUserAvatar()}
              </div>
              <span className="text-white text-sm" key={user?.username}>
                {user?.username || 'User'}
              </span>
            </button>
            <Button
              variant="ghost"
              onClick={logout}
              className="text-white hover:text-red-400"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button
            variant="fantasy"
            onClick={() => navigate('/signin')}
            className="text-white"
          >
            Sign In
          </Button>
        )}
      </nav>
    </header>
  );
}

export default Header;