// Provides a confirmation modal for deleting the user's account.
import React from 'react';

const ProfileHeader = ({ user }) => {
  const safeUser = {
    username: user?.username || 'Anonymous',
    email: user?.email || 'No email provided',
    avatar: user?.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.username || 'user'}`
  };

  return (
    <div className="bg-banana-dark p-6 flex items-center rounded-lg shadow-lg">
      <div className="flex-1 flex justify-center">
        <div className="relative inline-block p-2 rounded-full bg-amber-400 shadow-lg">
          <img
            src={safeUser.avatar}
            alt="User Avatar"
            className="w-16 h-16 rounded-full shadow-xl"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://api.dicebear.com/8.x/initials/svg?seed=${safeUser.username}`;
            }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          {safeUser.username}
        </h1>
        <p className="text-banana-light text-gray-300 mb-4">
          {safeUser.email}
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;