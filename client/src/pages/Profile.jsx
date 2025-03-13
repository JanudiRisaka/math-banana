import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Button } from '../components/Layout/Button';
import { User, Trophy, GamepadIcon, Calendar } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Fetch profile details from the backend if user is authenticated
      const fetchProfile = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/user/profile/${user.id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setProfile(response.data);
        } catch (error) {
          console.error('Error fetching profile:', error.message);
        }
      };

      fetchProfile();
    }
  }, [user]);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  const handleUpdateProfile = async () => {
    try {
      const updatedData = { username: newUsername || user.username };
      if (newPassword) updatedData.password = newPassword; // Update only if provided

      const response = await axios.put(
        `/mathbanana/profile/${user.id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setProfile(response.data);
      setShowUpdateModal(false);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error.message);
    }
  };


  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`/mathbanana/profile/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      logout(); // Log out the user
      navigate('/login'); // Redirect to login page
      alert('Account deleted successfully');
    } catch (error) {
      console.error('Error deleting account:', error.message);
    }
  };

  return (
    <div className="min-h-auto flex flex-col items-center justify-center bg-cover bg-center">
      <div className="inset-0 from-[#001B3D]/90 to-[#000B1A]/90 backdrop-blur-sm">
        <div className="relative z-10 w-full max-w-2xl">
          <div className="p-8 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
            {/* Header */}
            <div className="bg-banana-dark p-6 text-center">
              <div className="inline-block p-4 rounded-full bg-white mb-4">
                <User className="w-12 h-12 text-banana-dark" />
              </div>
              <h1 className="text-2xl font-bold text-white">{user.username}</h1>
              <p className="text-banana-light">{user.email}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Trophy className="w-8 h-8 text-banana-dark mx-auto mb-2" />
                <p className="text-sm text-gray-600">High Score</p>
                <p className="text-xl font-bold">{profile?.stats?.highScore || 'N/A'}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <GamepadIcon className="w-8 h-8 text-banana-dark mx-auto mb-2" />
                <p className="text-sm text-gray-600">Games Played</p>
                <p className="text-xl font-bold">{profile?.stats?.gamesPlayed || 'N/A'}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Trophy className="w-8 h-8 text-banana-dark mx-auto mb-2" />
                <p className="text-sm text-gray-600">Wins</p>
                <p className="text-xl font-bold">{profile?.stats?.wins || 'N/A'}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-8 h-8 text-banana-dark mx-auto mb-2" />
                <p className="text-xl font-bold">{profile?.stats?.dailyStreak || 'N/A'}</p>
                <p className="text-gray-600">
                  Last Played: {profile?.stats?.lastPlayed ? new Date(profile.stats.lastPlayed).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="p-6 border-t">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600">
                  Last Game Score: {profile?.stats?.lastGameScore || 'N/A'}
                </p>
                <p className="text-gray-600">
                  Last Played: {profile?.dailyStreak?.lastPlayed ? new Date(profile.dailyStreak.lastPlayed).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t text-gray-500 bg-amber-300 rounded text-center mr-30 ml-30">
              <Button variant="secondary" fullWidth onClick={() => navigate('/')}>
                Back to Menu
              </Button>
              {/* Update Button */}
              <Button variant="primary" fullWidth onClick={() => setShowUpdateModal(true)}>
                Update Profile
              </Button>
              {/* Delete Button */}
              <Button variant="danger" fullWidth onClick={() => setShowDeleteModal(true)}>
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
            <div className="mb-4">
              <label className="block text-gray-700">New Username</label>
              <input
                type="text"
                className="w-full p-2 mt-2 border border-gray-300 rounded"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">New Password</label>
              <input
                type="password"
                className="w-full p-2 mt-2 border border-gray-300 rounded"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUpdateProfile}>
                Update
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-2xl font-semibold mb-4">Are you sure?</h2>
            <p className="text-gray-700 mb-4">Do you really want to delete your account? This action is irreversible.</p>
            <div className="flex justify-end space-x-4">
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteAccount}>
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
