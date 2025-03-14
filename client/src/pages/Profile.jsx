import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfileStats from '../components/Profile/ProfileStats';
import RecentActivity from '../components/Profile/RecentActivity';
import Actions from '../components/Profile/Actions';
import UpdateModal from '../components/Profile/UpdateModal';
import DeleteModal from '../components/Profile/DeleteModal';

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
      if (newPassword) updatedData.password = newPassword;

      const response = await axios.put(
        `http://localhost:5000/user/profile/${user.id}`,
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
      await axios.delete(`/user/profile/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      logout();
      navigate('/login');
      alert('Account deleted successfully');
    } catch (error) {
      console.error('Error deleting account:', error.message);
    }
  };

  return (
    <div className="min-h-auto flex flex-col items-center justify-center bg-cover bg-center">
      {/* Main Profile Content */}
      <div className="inset-0 from-[#001B3D]/90 to-[#000B1A]/90 backdrop-blur-sm">
        <div className="relative z-10 w-full max-w-2xl">
          <div className="p-8 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
            <ProfileHeader user={user} />
            <ProfileStats stats={profile.stats} />
            <RecentActivity stats={profile.stats} />
            <Actions
              onUpdateClick={() => setShowUpdateModal(true)}
              onDeleteClick={() => setShowDeleteModal(true)}
            />
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <UpdateModal
          showModal={showUpdateModal}
          onCancel={() => setShowUpdateModal(false)}
          onUpdate={handleUpdateProfile}
          newUsername={newUsername}
          setNewUsername={setNewUsername}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
        />
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteModal
          showModal={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onDelete={handleDeleteAccount}
        />
      )}
    </div>
  );
};

export default Profile;