
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Briefcase, Filter } from 'lucide-react';
import AnyOptionBadge from '../badges/AnyOptionBadge';

interface LeadsHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  location?: string;
}

const LeadsHeader: React.FC<LeadsHeaderProps> = ({ onRefresh, isLoading, location }) => {
  const navigate = useNavigate();

  const handleRefresh = (e: React.MouseEvent) => {
    e.preventDefault();
    onRefresh();
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Briefcase className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold tracking-tight">My Leads</h2>
        {location === 'Any' && (
          <div className="ml-2">
            <AnyOptionBadge label="Location" />
          </div>
        )}
      </div>
      
      <div className="flex gap-3">
        <Button 
          onClick={() => navigate('/dashboard/freelancer/lead-settings')} 
          variant="outline" 
          size="default"
          className="flex items-center h-9"
        >
          <Filter className="mr-2 h-4 w-4" />
          Update Filters
        </Button>
        <Button 
          onClick={handleRefresh} 
          size="sm" 
          variant="outline" 
          className="flex items-center"
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
    </div>
  );
};

export default LeadsHeader;
