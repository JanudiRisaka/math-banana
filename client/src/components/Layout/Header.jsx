//client/src/components/Layout/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, Trophy, User, Info, Share2, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { useGameStore } from '../../stores/useGameStore.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import backgroundMusic from '../../assets/Genshin Impact Main Theme.mp3';

function Header() {
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const { isMuted: storeMuted, toggleMute: storeToggleMute, resetGame } = useGameStore();
  const [audioMuted, audioToggleMute] = useAudio(backgroundMusic, storeMuted);
  const navigate = useNavigate();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Math Banana',
        text: 'Check out this awesome math game!',
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback for browsers without Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleLogoClick = () => {
    resetGame();
    navigate('/');
  };

  const handleToggleMute = () => {
    storeToggleMute();
    audioToggleMute();
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
        {storeMuted ? ( // Use storeMuted here
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
        {/* Render leaderboard icon only when authenticated */}
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
      {/* Avatar with smart fallback */}
      <div className="relative">
        <img
          src={user?.avatar}
          alt="User Avatar"
          className="w-8 h-8 rounded-full border-2 border-yellow-400 object-cover"
          onError={(e) => {
            // Fallback 1: Directly to generated initials avatar
            e.target.onerror = null;
            e.target.src = `https://api.dicebear.com/8.x/initials/svg?seed=${user?.username}`;

            // Fallback 2: If initials avatar fails, show default icon
            e.target.addEventListener('error', () => {
              e.target.style.display = 'none';
              const fallbackIcon = document.createElement('div');
              fallbackIcon.className = 'w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full';
              fallbackIcon.innerHTML = '<User class="w-5 h-5 text-yellow-400" />';
              e.target.parentNode.insertBefore(fallbackIcon, e.target);
            }, { once: true });
          }}
        />

        {/* Loading state */}
        {!user?.avatar && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-700 rounded-full animate-pulse">
            <User className="w-5 h-5 text-yellow-400" />
          </div>
        )}
      </div>

      <span className="text-white text-sm">
        {user?.username || 'User'}
      </span>
    </button>
    <Button
      variant="ghost"
      onClick={() => {
        logout();
      }}
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
