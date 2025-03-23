
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

const UserCredits: React.FC = () => {
  const navigate = useNavigate();
  const { creditBalance, isLoadingBalance } = useCredits();

  const creditDisplay = (
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

  // Return directly without double-wrapping with NotificationsProvider
  return creditDisplay;
};

export default UserCredits;
