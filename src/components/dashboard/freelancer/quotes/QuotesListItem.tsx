
import React from 'react';
import PurchasedProjectCard from '../PurchasedProjectCard';
import { ApplicationWithProject } from '@/hooks/freelancer/useApplicationsWithQuotes';
import { cn } from '@/lib/utils';
import { formatRole, formatBudget, formatDuration, formatLocation, formatWorkType, formatDate } from '@/utils/projectFormatters';
import { Calendar, MapPin, Briefcase, Tag, Building, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useContactInfo } from '@/hooks/leads/useContactInfo';

interface QuotesListItemProps {
  project: ApplicationWithProject;
}

const QuotesListItem: React.FC<QuotesListItemProps> = ({ project }) => {
  const navigate = useNavigate();
  const { clientInfo } = useContactInfo(project.id);
  
  // Define status-based styles
  const getStatusStyles = (status?: string) => {
    switch (status) {
      case 'accepted':
        return 'border-2 border-green-500 bg-green-50';
      case 'pending':
        return 'border-2 border-amber-500 bg-yellow-50';
      case 'declined':
        return 'border-2 border-red-500 bg-red-50';
      default:
        return 'border-2 border-gray-300 bg-gray-50';
    }
  };

  const handleViewDetails = () => {
    navigate(`/project/${project.id}`);
  };

  const handleStartChat = () => {
    // Implementation for starting a chat
    navigate(`/dashboard/messages?projectId=${project.id}`);
  };

  const handleViewQuote = () => {
    navigate(`/project/${project.id}/quote`);
  };

  // Format the client name, with fallback
  const clientName = clientInfo?.contact_name || 'Unknown Client';

  return (
    <div className={cn("rounded-md overflow-hidden", getStatusStyles(project.quote_status))}>
      <div className="p-4 bg-white">
        {/* Status badge at the top right */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{project.title}</h3>
          {project.quote_status && (
            <Badge variant={
              project.quote_status === 'accepted' ? 'success' : 
              project.quote_status === 'pending' ? 'outline' : 
              'destructive'
            }>
              {project.quote_status.charAt(0).toUpperCase() + project.quote_status.slice(1)}
            </Badge>
          )}
        </div>
        
        {/* Compact Project Metadata */}
        <div className="flex flex-wrap gap-y-2 mb-3">
          <div className="w-1/2 flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(project.created_at)}</span>
          </div>
          
          <div className="w-1/2 flex items-center text-sm text-muted-foreground">
            <Building className="h-4 w-4 mr-2" />
            <span>{formatBudget(project.budget || '')}</span>
          </div>
          
          <div className="w-1/2 flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{formatLocation(project.location || '')}</span>
          </div>
          
          <div className="w-1/2 flex items-center text-sm text-muted-foreground">
            <Tag className="h-4 w-4 mr-2" />
            <span>{formatRole(project.role || '')}</span>
          </div>

          <div className="w-full flex items-center text-sm text-muted-foreground mt-1">
            <User className="h-4 w-4 mr-2" />
            <span>Client: {clientName}</span>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleStartChat}
          >
            Message Now
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleViewQuote}
          >
            View Quote
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuotesListItem;
