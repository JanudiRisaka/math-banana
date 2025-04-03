// src/components/Profile/AvatarSelector.jsx
/**
 * Avatar Selector Component
 * - Demonstrates Interoperability with DiceBear API
 * - Implements Event-Driven flow for avatar generation
 * - Maintains Virtual Identity through avatar persistence
 */
import React, { useState, useEffect } from 'react';
import { Button } from '../Layout/Button';

const AvatarSelector = ({ user, onSave, onCancel }) => {
  // State management for avatar customization
  const [selectedStyle, setSelectedStyle] = useState('lorelei');
  const [seed, setSeed] = useState(user?.username || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const avatarStyles = [
    { value: 'lorelei', label: 'Lorelei' },
    { value: 'pixel-art', label: 'Pixel Art' },
    { value: 'identicon', label: 'Identicon' },
    { value: 'bottts', label: 'Robot' },
    { value: 'avataaars', label: 'Avatar' },
    { value: 'thumbs', label: 'Thumbs' },
    { value: 'initials', label: 'Initials' }
  ];

  // Event: Generate new avatar URL when settings change
  const generateAvatar = () => {
    try {
      const trimmedSeed = seed.trim() || 'anonymous';
      const url = `https://api.dicebear.com/7.x/${selectedStyle}/svg?seed=${encodeURIComponent(trimmedSeed)}&rnd=${Date.now()}`;
      setAvatarUrl(url);
      setError('');
    } catch (err) {
      setError('Failed to generate avatar. Please try again.');
    }
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  };

  // Event: Save handler with validation
  const handleSave = async () => {
    if (!validateUrl(avatarUrl)) {
      setError('Invalid avatar URL format. Please refresh.');
      return;
    }
    setIsSaving(true);
    try {
      await onSave({ avatar: avatarUrl });
      setError('');
    } catch (err) {
      setError('Failed to save avatar. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    generateAvatar();
  }, [selectedStyle, seed]);

  const generateRandomSeed = () => {
    setSeed(Math.random().toString(36).substring(2, 10));
  };

  return (
    <div className="p-6 bg-white/5 rounded-lg border border-white/10 space-y-6">
      <h3 className="text-xl font-semibold text-white text-center">Customize Avatar</h3>

      <div className="flex flex-col items-center space-y-4">
        {/* Big Avatar Preview */}
        <div className="w-48 h-48 rounded-full border-4 border-yellow-400/30 overflow-hidden bg-white/10 flex items-center justify-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar Preview"
              className="w-full h-full object-cover"
              onError={() => setError('Avatar failed to load. Try a different style or seed.')}
            />
          ) : (
            <span className="text-gray-400">No preview</span>
          )}
        </div>
        <p className="text-gray-400 text-sm">Live Preview</p>

        {/* Controls */}
        <div className="w-full space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Style</label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400"
            >
              {avatarStyles.map((style) => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Custom Seed</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="Enter custom seed"
                className="flex-1 p-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400"
              />
              <Button
                onClick={generateRandomSeed}
                variant="secondary"
                title="Generate random seed"
                className="px-3 py-2 bg-yellow-400 text-black hover:bg-yellow-500 active:scale-95 transition duration-200 ease-in-out"
              >
                🎲
              </Button>
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm p-2 bg-red-900/20 border border-red-900/30 rounded">
              {error}
            </div>
          )}

          {/* Yellow Buttons with hover and click animations */}
          <div className="flex flex-col gap-4">
            <Button
              onClick={handleSave}
              variant="primary"
              disabled={isSaving}
              className="w-full px-4 py-2 bg-yellow-400 text-black hover:bg-yellow-500 active:scale-95 transition duration-200 ease-in-out"
            >
              {isSaving ? 'Saving...' : 'Apply This Avatar'}
            </Button>
            <Button
              onClick={onCancel}
              variant="ghost"
              className="w-full px-4 py-2 bg-yellow-400 text-black hover:bg-yellow-500 active:scale-95 transition duration-200 ease-in-out"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarSelector;
