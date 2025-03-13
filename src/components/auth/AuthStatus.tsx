
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, LogOut, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: 'destructive',
        title: 'Sign Out Failed',
        description: 'There was an error signing out. Please try again.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Link to="/auth/login">
          <Button variant="ghost" size="sm">
            Log in
          </Button>
        </Link>
        <Link to="/auth/signup">
          <Button size="sm">Sign up</Button>
        </Link>
      </div>
    );
  }

  const userType = user?.user_metadata?.user_type || '';
  const displayName = user?.user_metadata?.full_name || 
                      user?.user_metadata?.contact_name || 
                      user?.user_metadata?.company_name || 
                      user?.email || 
                      'User';

  return (
    <div className="flex items-center space-x-4">
      <div className="hidden md:flex flex-col items-end">
        <p className="text-sm font-medium">{displayName}</p>
        <p className="text-xs text-muted-foreground capitalize">{userType}</p>
      </div>
      <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign out">
        <LogOut className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default AuthStatus;
