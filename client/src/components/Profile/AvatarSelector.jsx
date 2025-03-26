import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './Button'; // Adjust import path as needed

const AvatarSelector = ({ user, onSave }) => {
  const [selectedStyle, setSelectedStyle] = useState('lorelei');
  const [seed, setSeed] = useState(user?.username || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Generate avatar URL
  const generateAvatar = () => {
    const trimmedSeed = seed.trim() || 'anonymous';
    const url = `https://api.dicebear.com/8.x/${selectedStyle}/svg?seed=${encodeURIComponent(trimmedSeed)}`;
    setAvatarUrl(url);
  };

  // Save avatar to backend
  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/user/profile/${user.id}`,
        { avatar: avatarUrl },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // Update parent components
      onSave(response.data.user.avatar); // Pass full avatar URL
      updateUser(response.data.user); // Update auth context

    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  // Regenerate avatar when style or seed changes
  useEffect(() => {
    generateAvatar();
  }, [selectedStyle, seed]);

  return (
    <div className="space-y-6 p-4 bg-white/5 rounded-lg border border-white/10">
      <h3 className="text-xl font-semibold text-white mb-4">Customize Avatar</h3>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Preview Section */}
        <div className="flex flex-col items-center">
          <div className="w-48 h-48 rounded-full border-4 border-yellow-400/30 overflow-hidden">
            <img
              src={avatarUrl}
              alt="Avatar Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-gray-400 text-sm mt-2">Live Preview</p>
        </div>

        {/* Controls Section */}
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Style</label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-yellow-400"
            >
              <option value="lorelei">Lorelei</option>
              <option value="pixel-art">Pixel Art</option>
              <option value="identicon">Identicon</option>
              <option value="bottts">Robot</option>
              <option value="avataaars">Avatar</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Custom Seed</label>
            <input
              type="text"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="Enter custom seed"
              className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}

          <div className="flex gap-4 mt-6">
            <Button
              onClick={generateAvatar}
              variant="secondary"
              className="flex-1"
            >
              ↻ Regenerate
            </Button>

            <Button
              onClick={handleSave}
              variant="primary"
              className="flex-1"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Avatar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarSelector;