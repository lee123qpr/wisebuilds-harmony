
import React from 'react';
import PurchasedProjectCard from '../PurchasedProjectCard';
import { ApplicationWithProject } from '@/hooks/freelancer/useApplicationsWithQuotes';
import { cn } from '@/lib/utils';
import { formatRole, formatBudget, formatDuration, formatLocation, formatWorkType } from '@/utils/projectFormatters';
import { format } from 'date-fns';
import { Calendar, MapPin, Clock, Briefcase, Tag, Building } from 'lucide-react';

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

  // Format dates if available
  const formattedPostedDate = project.created_at 
    ? format(new Date(project.created_at), 'dd MMM yyyy')
    : 'Not specified';
    
  const formattedStartDate = project.start_date
    ? format(new Date(project.start_date), 'dd MMM yyyy')
    : 'Not specified';

  return (
    <div className={cn("rounded-md overflow-hidden", getStatusStyles(project.quote_status))}>
      <PurchasedProjectCard 
        key={project.id}
        project={{
          ...project,
          quote_status: project.quote_status
        }}
      />
      
      {/* Project Metadata Panel */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {/* Posted Date */}
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Posted Date</p>
              <p className="text-sm font-medium">{formattedPostedDate}</p>
            </div>
          </div>
          
          {/* Start Date */}
          <div className="flex items-start gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Start Date</p>
              <p className="text-sm font-medium">{formattedStartDate}</p>
            </div>
          </div>
          
          {/* Role */}
          <div className="flex items-start gap-2">
            <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Role</p>
              <p className="text-sm font-medium">{formatRole(project.role || '')}</p>
            </div>
          </div>
          
          {/* Budget */}
          <div className="flex items-start gap-2">
            <Building className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Budget</p>
              <p className="text-sm font-medium">{formatBudget(project.budget || '')}</p>
            </div>
          </div>
          
          {/* Duration */}
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="text-sm font-medium">{formatDuration(project.duration || '')}</p>
            </div>
          </div>
          
          {/* Location */}
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium">{formatLocation(project.location || '')}</p>
            </div>
          </div>
          
          {/* Work Type */}
          <div className="flex items-start gap-2 col-span-1 md:col-span-3">
            <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Work Type</p>
              <p className="text-sm font-medium">{formatWorkType(project.work_type || '')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotesListItem;
