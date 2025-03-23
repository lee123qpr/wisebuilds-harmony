
import React from 'react';
import { User } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';
import UserProfile from './UserProfile';
import UserCredits from './UserCredits';
import AdminBadge from './AdminBadge';
import UserNavigationButtons from './UserNavigationButtons';

interface UserMenuProps {
  user: User;
  onSignOut: () => void;
  isLoading: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, onSignOut, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }
  
  const userType = user?.user_metadata?.user_type || '';
  const isFreelancer = userType === 'freelancer';
  const isAdmin = userType === 'admin';

  return (
    <UserProfile user={user}>
      {(displayName, isLoadingProfile) => (
        <div className="flex items-center space-x-3">
          {/* User Info */}
          {!isLoadingProfile && (
            <div className="hidden md:flex flex-col items-end">
              <p className="text-sm font-medium">{displayName || user?.user_metadata?.full_name || 'User'}</p>
              <p className="text-xs text-muted-foreground capitalize">{userType === 'business' ? 'Client' : userType}</p>
            </div>
          )}
          
          {/* Credits Button - Only shown for freelancers */}
          {isFreelancer && <UserCredits />}
          
          {/* Admin Badge - Only shown for admins */}
          {isAdmin && <AdminBadge />}
          
          {/* Navigation Buttons */}
          <UserNavigationButtons 
            userType={userType} 
            onSignOut={onSignOut} 
          />
        </div>
      )}
    </UserProfile>
  );
};

export default UserMenu;
