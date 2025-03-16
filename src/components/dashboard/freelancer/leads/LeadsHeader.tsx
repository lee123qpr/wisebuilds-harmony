
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
    <div className="flex justify-between items-center p-4 bg-white border-b">
      <div className="flex items-center gap-2">
        <Briefcase className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">My Leads</h2>
      </div>
      
      <div className="flex gap-2">
        <Button 
          onClick={() => navigate('/dashboard/freelancer/lead-settings')} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          <Filter className="h-4 w-4" />
          <span>Update Filters</span>
        </Button>
        <Button 
          onClick={onRefresh}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>
    </div>
  );
};

export default LeadsHeader;
