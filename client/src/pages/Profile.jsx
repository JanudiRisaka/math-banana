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
import toast from 'react-hot-toast';

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

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile on component mount
    fetchUserProfile().catch(err => {
      console.error('Error fetching profile:', err);
      toast.error('Failed to load profile');
    });
  }, []);

  // Navigation handling
  useEffect(() => {
    if (!authLoading && !authUser) {
      navigate('/signin');
    }
  }, [authUser, authLoading, navigate]);

  // Profile data fetching using UserContext
  useEffect(() => {
    if (authUser && !userProfile) {
      fetchUserProfile().catch(err => {
        console.error('Error fetching profile:', err);
        if (err.message?.includes('Not Authorized')) {
          navigate('/signin');
        }
      });
    }
  }, [authUser, userProfile, fetchUserProfile, navigate]);

  // Handle loading state
  if (authLoading || userLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 flex justify-center">
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Handle error state
  if (authError || userError) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 text-red-400 text-center">
        {authError || userError}
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-yellow-400 hover:text-yellow-300"
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
      updateUser(updatedUser);
      setShowUpdateModal(false);
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      toast.success('Account deleted successfully');
      navigate('/');  // Redirect to home page after successful deletion
    } catch (err) {
      toast.error('Failed to delete account: ' + err.message);
    }
  };

  return (
    <div className="min-h-auto flex flex-col items-center justify-center bg-cover bg-center">
      <div className="inset-0 from-[#001B3D]/90 to-[#000B1A]/90 backdrop-blur-sm">
        <div className="relative z-10 w-full max-w-2xl">
          <div className="p-8 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
            <ProfileHeader user={userProfile || authUser}  />

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
          currentAvatar={userProfile?.avatar || user?.avatar}
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