import React from 'react';
import { User } from 'lucide-react';

const ProfileHeader = ({ user }) => (
  <div className="bg-banana-dark p-6 flex items-center rounded-lg shadow-lg">
    {/* Left Side - Profile Photo */}
    <div className="flex-1 flex justify-center">
      <div className="relative inline-block p-2 rounded-full bg-white shadow-lg">
        <User className="w-16 h-16 text-banana-dark" />
      </div>
    </div>

    {/* Right Side - User Info */}
    <div className="flex-1 flex flex-col items-center text-center">
      <h1 className="text-3xl font-bold text-white mb-2">{user.username}</h1>
      <p className="text-banana-light text-gray-300 mb-4">{user.email}</p>
    </div>
  </div>
);

export default ProfileHeader;
