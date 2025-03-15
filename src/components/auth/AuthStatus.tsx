
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, LogOut, User, LayoutDashboard, Bell, Coins } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCredits } from '@/hooks/useCredits';

const AuthStatus = () => {
  const { user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hasNotifications] = useState(false);
  const { creditBalance, isLoadingBalance } = useCredits();
  const isFreelancer = user?.user_metadata?.user_type === 'freelancer';

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
      
      {/* Credits Button - Only shown for freelancers */}
      {isFreelancer && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" title="Credits" onClick={() => navigate('/dashboard/freelancer/credits')}>
              <Coins className="h-5 w-5 text-yellow-500" />
              {!isLoadingBalance && creditBalance > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] text-white flex items-center justify-center font-medium">
                  {creditBalance > 99 ? '99+' : creditBalance}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none mb-2">Credit Balance</h4>
              {isLoadingBalance ? (
                <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <div className="flex items-baseline">
                  <span className="text-xl font-bold">{creditBalance || 0}</span>
                  <span className="ml-2 text-sm text-muted-foreground">credits</span>
                </div>
              )}
              <Button 
                className="w-full mt-2" 
                size="sm"
                onClick={() => navigate('/dashboard/freelancer/credits')}
              >
                Buy More Credits
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
      
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
