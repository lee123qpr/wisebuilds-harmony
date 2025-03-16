
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, LogOut, User, LayoutDashboard, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const AuthStatus = () => {
  const { user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hasNotifications] = useState(false);

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
  
  // Get dashboard link based on user type
  const getDashboardLink = () => {
    switch(userType) {
      case 'freelancer':
        return '/dashboard/freelancer';
      case 'business':
        return '/dashboard/business';
      case 'admin':
        return '/dashboard/admin';
      default:
        return '/';
    }
  };

  // Get profile link based on user type
  const getProfileLink = () => {
    switch(userType) {
      case 'business':
        return '/dashboard/business/profile';
      case 'freelancer':
        return '/dashboard/freelancer/profile';
      default:
        return '/';
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="hidden md:flex flex-col items-end">
        <p className="text-sm font-medium">{displayName}</p>
        <p className="text-xs text-muted-foreground capitalize">{userType}</p>
      </div>
      
      {/* Notifications Bell */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {hasNotifications && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none mb-2">Notifications</h4>
            <p className="text-sm text-muted-foreground">
              You have no new notifications.
            </p>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Dashboard Button */}
      <Link to={getDashboardLink()} title="Dashboard">
        <Button variant="ghost" size="icon">
          <LayoutDashboard className="h-5 w-5" />
        </Button>
      </Link>
      
      {/* Profile Button */}
      <Link to={getProfileLink()} title="Profile">
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </Link>
      
      {/* Sign Out Button */}
      <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign out">
        <LogOut className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default AuthStatus;
