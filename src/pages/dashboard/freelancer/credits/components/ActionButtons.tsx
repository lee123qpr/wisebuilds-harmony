
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ActionButtonsProps {
  isRefreshing: boolean;
  handleManualRefresh: () => Promise<void>;
}

const ActionButtons = ({ isRefreshing, handleManualRefresh }: ActionButtonsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col gap-3">
      <Button 
        onClick={handleManualRefresh}
        className="w-full flex items-center justify-center"
        disabled={isRefreshing}
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
        {isRefreshing ? 'Refreshing...' : 'Refresh Credit Balance'}
      </Button>
      
      <Button 
        onClick={() => navigate('/dashboard/freelancer/credits')}
        className="w-full flex items-center justify-center"
        variant="default"
      >
        View My Credits
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
      
      <Button 
        onClick={() => navigate('/dashboard/freelancer')}
        variant="outline"
        className="w-full"
      >
        Return to Dashboard
      </Button>
    </div>
  );
};

export default ActionButtons;
