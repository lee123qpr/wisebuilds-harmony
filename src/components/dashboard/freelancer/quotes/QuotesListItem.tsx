
import React from 'react';
import PurchasedProjectCard from '../PurchasedProjectCard';
import { ApplicationWithProject } from '@/hooks/freelancer/useApplicationsWithQuotes';
import { cn } from '@/lib/utils';
import { formatRole, formatBudget, formatDuration, formatLocation, formatWorkType, formatDate } from '@/utils/projectFormatters';
import { Calendar, MapPin, Briefcase, Tag, Building } from 'lucide-react';

interface QuotesListItemProps {
  project: ApplicationWithProject;
}

const QuotesListItem: React.FC<QuotesListItemProps> = ({ project }) => {
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

  return (
    <div className={cn("rounded-md overflow-hidden", getStatusStyles(project.quote_status))}>
      <PurchasedProjectCard 
        key={project.id}
        project={{
          ...project,
          quote_status: project.quote_status
        }}
      />
      
      {/* Compact Project Metadata */}
      <div className="px-4 pb-4 -mt-2 bg-white">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {/* Posted Date */}
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(project.created_at)}</span>
          </div>
          
          {/* Budget */}
          <div className="flex items-center gap-1">
            <Building className="h-4 w-4" />
            <span>{formatBudget(project.budget || '')}</span>
          </div>
          
          {/* Location */}
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{formatLocation(project.location || '')}</span>
          </div>
          
          {/* Role */}
          <div className="flex items-center gap-1">
            <Tag className="h-4 w-4" />
            <span>{formatRole(project.role || '')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotesListItem;
