import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, Trophy, User, Info, Share2, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { useGameStore } from '../../stores/useGameStore.js';
import { useAuth } from '../../contexts/AuthContext';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, EmailShareButton } from 'react-share'; // Import share buttons from react-share
import { FacebookIcon, TwitterIcon, WhatsappIcon, EmailIcon } from 'react-share'; // Import the icons


function Header() {
  const { isMuted, toggleMute, resetGame } = useGameStore();
  const { user, isAuthenticated, login, logout } = useAuth();
  const navigate = useNavigate();

const handleShare = () => {
    const options = {
      title: 'Share via',
      message: 'Check out this awesome content!',
      url: 'http://localhost:5173/',  // URL to share
      social: Share.Social.EMAIL,      // This is just an example, you can specify any platform
    };

    Share.open(options)
      .then((res) => {
        console.log('Shared successfully:', res);
      })
      .catch((err) => {
        err && console.log('Error sharing:', err);
      });
  };

  const handleLogoClick = () => {
    resetGame();
    navigate('/');
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
          onClick={toggleMute}
          className="text-white hover:text-yellow-400 transition-all duration-300"
        >
          {isMuted ? <VolumeX /> : <Volume2 />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-yellow-400 transition-all duration-300"
          onClick={() => navigate('/help')}
        >
          <Info />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/leaderboard')}
          className="text-white hover:text-yellow-400 transition-all duration-300"
        >
          <Trophy />
        </Button>
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
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-yellow-400"
                />
              ) : (
                <User className="w-6 h-6 text-yellow-400" />
              )}
              <span className="text-white text-sm">{user?.name}</span>
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
