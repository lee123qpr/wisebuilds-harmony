
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import LoginSignupButtons from './LoginSignupButtons';
import UserMenu from './UserMenu';

const AuthStatus = () => {
  const { user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });
      navigate('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: 'destructive',
        title: 'Sign Out Failed',
        description: 'There was an error signing out. Please try again.',
      });
    }
  };

  if (!user) {
    return <LoginSignupButtons />;
  }

  return (
    <UserMenu 
      user={user}
      isLoading={isLoading}
      onSignOut={handleSignOut}
    />
  );
};

export default AuthStatus;
