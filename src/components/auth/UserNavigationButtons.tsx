
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, User, LayoutDashboard } from 'lucide-react';

interface UserNavigationButtonsProps {
  userType: string;
  onSignOut: () => void;
}

const UserNavigationButtons: React.FC<UserNavigationButtonsProps> = ({ userType, onSignOut }) => {
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
    <>
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
      <Button variant="ghost" size="icon" onClick={onSignOut} title="Sign out">
        <LogOut className="h-5 w-5" />
      </Button>
    </>
  );
};

export default UserNavigationButtons;
