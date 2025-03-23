
import React from 'react';
import { Button } from '@/components/ui/button';
import { Coins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCredits } from '@/hooks/useCredits';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { NotificationsProvider } from '@/context/NotificationsContext';

const UserCreditsInner: React.FC = () => {
  const navigate = useNavigate();
  
  // Try to use credits hook, but handle the case when notifications context is not available
  let creditBalance = 0;
  let isLoadingBalance = false;
  
  try {
    const credits = useCredits();
    creditBalance = credits.creditBalance;
    isLoadingBalance = credits.isLoadingBalance;
  } catch (error) {
    console.warn('Credits functionality unavailable - NotificationsProvider missing');
    // Fallback to default values (already set above)
  }

  return (
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
  );
};

// Wrapper component that ensures NotificationsProvider is available
const UserCredits: React.FC = () => {
  return (
    <NotificationsProvider>
      <UserCreditsInner />
    </NotificationsProvider>
  );
};

export default UserCredits;
