// Provides a modal interface for updating user profile details like username and avatar
import React, { useState } from 'react';
import { Button } from '../Layout/Button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import AvatarSelector from './AvatarSelector';

const UpdateModal = ({
  showModal,
  onCancel,
  onUpdate,
  currentAvatar,
  currentUsername
}) => {
  const [newUsername, setNewUsername] = useState(currentUsername || '');
  const [newAvatar, setNewAvatar] = useState(currentAvatar || '');
  const [view, setView] = useState('main'); // main or avatar

  if (!showModal) return null;

  const handleAvatarSave = async (avatarData) => {
    // Store the new avatar URL in state
    if (avatarData && avatarData.avatar) {
      setNewAvatar(avatarData.avatar);
    }
    // Switch back to main view after saving
    setView('main');
  };

  const handleUpdate = async () => {
    try {
      // Collect all update data including the avatar
      const updateData = {
        username: newUsername || undefined,
        avatar: newAvatar || undefined
      };

      // Only include non-empty fields
      const filteredData = Object.fromEntries(
        Object.entries(updateData).filter(([_, v]) => v !== undefined)
      );

      await onUpdate(filteredData);
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-[#001B3D] p-8 rounded-lg w-full max-w-md border border-white/10 shadow-xl"
      >
        {view === 'avatar' && (
          <Button
            variant="ghost"
            className="absolute left-4 top-4 text-white hover:text-yellow-400 z-20"
            onClick={() => setView('main')}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
        )}

        <div className="flex items-center justify-center my-8">
          <button className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white font-serif">Math Banana</h1>
          </button>
        </div>

        {view === 'main' ? (
          <>
            <h2 className="text-2xl font-bold text-center text-white mb-2">Update Profile</h2>
            <p className="text-center text-gray-300 mb-8">Customize your profile details</p>

            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                  New Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50"
                  placeholder="Enter new username"
                />
              </div>

              <div>
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-300 mb-1">
                  Avatar
                </label>
                <div className="flex items-center space-x-4">
                  <img
                    src={newAvatar || currentAvatar}
                    alt="Current Avatar"
                    className="w-12 h-12 rounded-full border-2 border-white/10"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://api.dicebear.com/7.x/identicon/svg?seed=fallback";
                    }}
                  />
                  <Button
                    variant="secondary"
                    onClick={() => setView('avatar')}
                    className="bg-sky-500 hover:bg-sky-700"
                  >
                    Change Avatar
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4 mt-6">
              <Button
                variant="ghost"
                className="text-white hover:text-yellow-400"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
                onClick={handleUpdate}
              >
                Update Profile
              </Button>
            </div>
          </>
        ) : (
          <AvatarSelector
            user={{ username: newUsername, avatar: newAvatar || currentAvatar }}
            onSave={handleAvatarSave}
            onCancel={() => setView('main')}
          />
        )}
      </motion.div>
    </div>
  );
};

export default UpdateModal;
