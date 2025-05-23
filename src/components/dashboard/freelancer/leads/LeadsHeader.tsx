
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Briefcase, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LeadsHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  location?: string;
  leadsCount?: number;
}

const LeadsHeader: React.FC<LeadsHeaderProps> = ({ 
  onRefresh, 
  isLoading, 
  location,
  leadsCount 
}) => {
  const navigate = useNavigate();

  const handleRefresh = (e: React.MouseEvent) => {
    e.preventDefault();
    onRefresh();
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Briefcase className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold tracking-tight">
          My Leads
          <Badge variant="outline" className="ml-2 text-sm font-medium bg-green-50 text-green-600 border-green-200">
            {isLoading ? '...' : leadsCount || 0}
          </Badge>
        </h2>
      </div>
      
      <div className="flex gap-3">
        <Button 
          onClick={() => navigate('/dashboard/freelancer/lead-settings')} 
          variant="outline" 
          size="default"
          className="flex items-center h-9"
        >
          <Filter className="mr-2 h-4 w-4" />
          Update Lead Settings
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
