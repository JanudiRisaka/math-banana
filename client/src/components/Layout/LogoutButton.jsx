import React, { useState } from 'react';
import { LogOut, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../../contexts/AuthContext';

const LogoutButton = ({ variant = 'ghost', className }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleLogout}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : (
        <LogOut className="w-4 h-4 mr-2" />
      )}
      Logout
    </Button>
  );
};

export default LogoutButton;
