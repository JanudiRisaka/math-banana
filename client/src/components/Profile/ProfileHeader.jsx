import React from 'react';
import { User } from 'lucide-react';

const ProfileHeader = ({ user }) => {
  // Fallback to generated avatar if none exists
  const avatarUrl = user?.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.username}`;

  return (
    <div className="bg-banana-dark p-6 flex items-center rounded-lg shadow-lg">
      <div className="flex-1 flex justify-center">
        <div className="relative inline-block p-2 rounded-full bg-amber-400 shadow-lg">
        <img
          src={user?.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.username}`}
          alt="User Avatar"
          className="w-16 h-16 rounded-full border-2 border-banana-dark"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://api.dicebear.com/8.x/initials/svg?seed=${user?.username}`;
          }}
        />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          {user?.username || 'Anonymous'}
        </h1>
        <p className="text-banana-light text-gray-300 mb-4">
          {user?.email || 'No email provided'}
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;