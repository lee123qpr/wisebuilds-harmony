
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, LogOut, User, LayoutDashboard, Coins, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCredits } from '@/hooks/useCredits';
import { supabase } from '@/integrations/supabase/client';

const AuthStatus = () => {
  const { user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { creditBalance, isLoadingBalance } = useCredits();
  const isFreelancer = user?.user_metadata?.user_type === 'freelancer';
  const isAdmin = user?.user_metadata?.user_type === 'admin';
  const [displayName, setDisplayName] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Fetch user profile data to get the most up-to-date display name
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      setIsLoadingProfile(true);
      const userType = user.user_metadata?.user_type;
      
      try {
        if (userType === 'freelancer') {
          // Fetch freelancer profile
          const { data, error } = await supabase
            .from('freelancer_profiles')
            .select('display_name, first_name, last_name')
            .eq('id', user.id)
            .maybeSingle();
          
          if (error) throw error;
          
          if (data) {
            setDisplayName(data.display_name || `${data.first_name || ''} ${data.last_name || ''}`.trim());
          }
        } else if (userType === 'business') {
          // Fetch business profile
          const { data, error } = await supabase
            .from('client_profiles')
            .select('contact_name, company_name')
            .eq('id', user.id)
            .maybeSingle();
          
          if (error) throw error;
          
          if (data) {
            setDisplayName(data.contact_name || data.company_name || '');
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    
    fetchUserProfile();
  }, [user]);

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

  if (isLoading || isLoadingProfile) {
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
  
  // Fall back to metadata if profile data not available
  const fallbackName = user?.user_metadata?.full_name || 
                      user?.user_metadata?.contact_name || 
                      user?.user_metadata?.company_name || 
                      user?.email || 
                      'User';
  
  const profileDisplayName = displayName || fallbackName;
  
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
      case 'admin':
        return '/dashboard/admin/profile'; // Admin profile if implemented
      default:
        return '/';
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="hidden md:flex flex-col items-end">
        <p className="text-sm font-medium">{profileDisplayName}</p>
        <p className="text-xs text-muted-foreground capitalize">{userType}</p>
      </div>
      
      {/* Credits Button - Only shown for freelancers */}
      {isFreelancer && (
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              title="Credits" 
              onClick={() => navigate('/dashboard/freelancer/credits')}
              className="flex items-center gap-1.5"
            >
              <Coins className="h-4 w-4 text-yellow-500" />
              {isLoadingBalance ? (
                <span className="h-4 w-8 bg-gray-200 animate-pulse rounded text-xs"></span>
              ) : (
                <span className="text-xs font-medium">{creditBalance || 0}</span>
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
      
      {/* Admin Badge - Only shown for admins */}
      {isAdmin && (
        <Button 
          variant="outline" 
          size="sm" 
          title="Admin Dashboard" 
          onClick={() => navigate('/dashboard/admin')}
          className="flex items-center gap-1.5 bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
        >
          <Shield className="h-4 w-4" />
          <span className="text-xs font-medium">Admin</span>
        </Button>
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
