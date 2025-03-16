
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Filter } from 'lucide-react';
import { Briefcase } from 'lucide-react';

interface LeadsHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

const LeadsHeader: React.FC<LeadsHeaderProps> = ({ onRefresh, isLoading }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center py-4 border-b">
      <div className="flex items-center gap-2">
        <Briefcase className="h-6 w-6" />
        <h2 className="text-2xl font-bold">My Leads</h2>
      </div>
      
      <div className="flex gap-2">
        <Button 
          onClick={() => navigate('/dashboard/freelancer/lead-settings')} 
          variant="outline" 
          className="flex items-center"
        >
          <Filter className="mr-2 h-4 w-4" />
          Update Filters
        </Button>
        <Button 
          onClick={onRefresh}
          variant="outline"
          className="flex items-center"
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default LeadsHeader;
