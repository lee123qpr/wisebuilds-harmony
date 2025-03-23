
import React from 'react';
import PurchasedProjectCard from '../PurchasedProjectCard';
import { ApplicationWithProject } from '@/hooks/freelancer/useApplicationsWithQuotes';
import { cn } from '@/lib/utils';
import { Calendar, Tag, MapPin, Building, Briefcase, Clock } from 'lucide-react';
import { formatBudget, formatDate, formatRole, formatWorkType, formatDuration } from '@/utils/projectFormatters';

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
      <div className="px-4 pt-4 pb-2">
        {/* Compact metadata display in one row */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
          {/* Posted Date */}
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>{formatDate(project.created_at)}</span>
          </div>
          
          {/* Budget */}
          <div className="flex items-center gap-1">
            <Tag className="h-4 w-4 text-gray-500" />
            <span>{formatBudget(project.budget)}</span>
          </div>
          
          {/* Location */}
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{project.location}</span>
          </div>
          
          {/* Role */}
          <div className="flex items-center gap-1">
            <Building className="h-4 w-4 text-gray-500" />
            <span>{formatRole(project.role)}</span>
          </div>
          
          {/* Work Type - New */}
          <div className="flex items-center gap-1">
            <Briefcase className="h-4 w-4 text-gray-500" />
            <span>{formatWorkType(project.work_type)}</span>
          </div>
          
          {/* Duration - New */}
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>{formatDuration(project.duration)}</span>
          </div>
        </div>
      </div>
      
      <PurchasedProjectCard 
        key={project.id}
        project={{
          ...project,
          quote_status: project.quote_status
        }}
      />
    </div>
  );
};

export default QuotesListItem;
