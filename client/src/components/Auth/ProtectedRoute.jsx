import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading, refreshUserData } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (!isLoading && !isAuthenticated) {
        // Not authenticated, will redirect
        setIsVerifying(false);
        return;
      } else if (!isLoading && isAuthenticated) {
        // Already authenticated, no need to verify again
        setIsVerifying(false);
        return;
      }

      // Wait for loading to finish
      setIsVerifying(false);
    };

    verifyAuth();
  }, [isLoading, isAuthenticated, refreshUserData]);

  if (isLoading || isVerifying) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-white" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;