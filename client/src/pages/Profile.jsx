/* Defines the page where users verify their email address using
an OTP sent to them.*/
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfileStats from '../components/Profile/ProfileStats';
import RecentActivity from '../components/Profile/RecentActivity';
import Actions from '../components/Profile/Actions';
import UpdateModal from '../components/Profile/UpdateModal';
import DeleteModal from '../components/Profile/DeleteModal';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';

const Profile = () => {
  const { user: authUser, updateUser, isLoading: authLoading, error: authError } = useAuth();
  const {
    userProfile,
    userStats,
    loading: userLoading,
    error: userError,
    fetchUserProfile,
    updateProfile,
    deleteAccount,
    logout
  } = useUser();
  const { fetchUserStats } = useGame();

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const navigate = useNavigate();

  // Navigation handling
  useEffect(() => {
    if (!authLoading && !authUser) {
      navigate('/signin');
    }
  }, [authUser, authLoading, navigate]);

  // Profile data fetching using UserContext
  useEffect(() => {
    if (authUser && !userProfile) {
      const loadProfile = async () => {
        try {
          setFetchError(null);
          await fetchUserProfile(true);
          fetchUserStats();
        } catch (err) {
          console.error('Error fetching profile:', err);
          setFetchError(err.message);
          if (err.message?.includes('Not Authorized') || err.message?.includes('401')) {
            navigate('/signin');
          }
        }
      };

      loadProfile();
    }
  }, [authUser, userProfile, fetchUserProfile, fetchUserStats, navigate]);

  // Handle loading state
  if (authLoading || userLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 flex justify-center">
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Handle error state
  if (authError || userError || fetchError) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 text-red-400 text-center">
        <p className="mb-4">{authError || userError || fetchError}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Handle not logged in
  if (!authUser) {
    return <div>Please log in to view your profile</div>;
  }

  const handleUpdateProfile = async (updateData) => {
    try {
      const updatedUser = await updateProfile(updateData);
      updateUser(updatedUser);  // Pass the updated user data
      setShowUpdateModal(false);
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      navigate('/signup');
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="min-h-auto flex flex-col items-center justify-center bg-cover bg-center">
      <div className="inset-0 from-[#001B3D]/90 to-[#000B1A]/90 backdrop-blur-sm">
        <div className="relative z-10 w-full max-w-2xl">
          <div className="p-8 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
            <ProfileHeader user={userProfile || authUser} />

            {/* Pass stats directly from userContext */}
            <ProfileStats stats={userStats} />
            <RecentActivity stats={userStats} />

            <Actions
              onUpdateClick={() => setShowUpdateModal(true)}
              onDeleteClick={() => setShowDeleteModal(true)}
            />
          </div>
        </div>
      </div>

      {showUpdateModal && (
        <UpdateModal
          showModal={showUpdateModal}
          onCancel={() => setShowUpdateModal(false)}
          onUpdate={handleUpdateProfile}
          currentAvatar={userProfile?.avatar || authUser?.avatar}
        />
      )}

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